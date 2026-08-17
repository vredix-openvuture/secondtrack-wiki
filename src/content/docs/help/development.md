---
title: Developing secondtrack
description: How the code is laid out, the rules that keep it that way, and how to add a setting, a migration, a page or an integration.
sidebar:
  order: 4
---

## Running it

```sh
git clone https://github.com/vredix-openvuture/secondtrack.git && cd secondtrack
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
SECONDTRACK_DB_PATH=./data/dev.db uvicorn app.main:app --reload
```

Use a separate database file for development. Every migration runs at startup, and running them
against your real data to try something out is how you find out that they are one-way.

## The layout

| Layer | Rule |
|---|---|
| `app/routers/` | HTTP only: parse the form, call a service, redirect. No business logic |
| `app/services/` | The domain. Takes a session and objects, returns objects. No `Request`, no templates |
| `app/services/integrations/` | One module per external system, and the **only** place that speaks HTTP to it |
| `app/models.py` | The ORM model, plus derived properties |
| `app/db.py` | Engine, session, settings helpers, every migration |
| `templates/` | Jinja. Logic here is presentation only |

The integration rule is the one worth defending: if a second module starts calling InvoiceNinja
directly, the error handling and the enabled check get duplicated and then diverge.

## The rules that are already load-bearing

- **One list of items.** `finance.project_items` feeds the project page, the calculation, the
  Markdown export and the invoice. Adding a fifth consumer means using that function, not writing a
  similar query.
- **Prices are per unit.** Forms take totals and divide; storage is per unit. Anything that
  displays or sums has to multiply by quantity.
- **A set swallows its members.** Anything walking the items of a project must skip parts that
  belong to a set on it.
- **Integrations fail quietly on reads and loudly on writes.** A read that fails shows a message.
  A write that fails, other than a best-effort mirror, raises.
- **A handler that talks to another system is `def`, not `async def`.** Every HTTP client here is
  synchronous, and a blocking call inside `async def` blocks the event loop, which means the whole
  application: one slow InvoiceNinja request would freeze the warehouse page, the login and
  `/healthz` alike. Declared as `def`, the handler runs in a threadpool and only its own request
  waits. Only handlers that genuinely `await` something, `await request.form()` or
  `await request.json()`, stay async.
- **Every migration is idempotent.** It runs on every start, so it has to find nothing to do the
  second time.

## Adding a setting

Two kinds.

**A connection or behaviour setting**, meaning something with an environment default:

1. Add the key to `DEFAULTS` in `app/runtime.py`, with its default as a string.
2. Add the field to the settings form and its handler in `app/routers/settings.py`. Use `_secret`
   for anything sensitive, so an empty submit keeps the stored value.
3. Read it with `runtime.get`, `get_bool` or `get_int`.

**A plain setting**, meaning anything else: use `get_setting` and `set_setting` with a fresh key.
No migration is needed, because the table is a key and value store.

Then add it to [Settings keys](/reference/settings/), and to
[Environment variables](/reference/environment/) if it has one.

## Adding a column

1. Add it to the model in `app/models.py`.
2. Add it to the right table in `_ensure_columns` in `app/db.py`, with its SQLite type and default.

`create_all` only creates missing tables, so an existing database never gets a new column without
that second step.

Backfilling existing rows is a separate function, called from `init_db`, guarded so that it finds
nothing to do on a second run. Filtering on the new value being NULL is usually the whole guard.

## Adding a page

1. A router module in `app/routers/`, with a prefix, and included in `app/main.py`.
2. Every handler takes `user=Depends(require_login)`.
3. Build the template context with `ctx(request, db, active="<nav key>", ...)`, which supplies the
   translator, the style, the wallpaper and the currency.
4. A template extending `base.html`.
5. If it belongs in the navigation, add it to the sidebar in `base.html`.

## Adding an integration

1. A module in `app/services/integrations/` with `is_enabled()`, a `_client()` and a `_require()`
   that raises when it is off.
2. Its keys in `runtime.DEFAULTS`, its environment defaults in `app/config.py`.
3. A tab in the settings template and a handler for it.
4. Every caller checks `is_enabled()` first and handles the failure rather than propagating it into
   a page render.

## Translations

`app/i18n.py` holds one dictionary per language, mapping the English source string to the
translation. A missing entry falls back to the source, so nothing breaks.

New user-facing text goes through `_()` in templates. Text in routers currently does not, which is
why some status messages are German regardless of the setting. Fixing that means routing those
messages through the translator too.

## Style

Line length is not enforced, but the code stays close to 90 columns. Comments explain **why**, not
what: several of the load-bearing ones in `db.py` and `warehouse.py` record decisions that look
arbitrary without them. `ruff` is used, without a committed configuration.

## Before opening a pull request

- Run it. There are no tests to hide behind.
- Run it against a database that has been through the migrations, not only a fresh one.
- If it changes a formula, check the project page, the export, the invoice and the statistics,
  since all four read the same source.
- Update this wiki. A feature that is not documented is a feature nobody finds.
