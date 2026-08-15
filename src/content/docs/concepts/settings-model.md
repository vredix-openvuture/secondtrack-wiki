---
title: How settings are stored
description: The three layers of configuration, which one wins, why secrets submitted blank are kept, and when a change takes effect.
sidebar:
  order: 4
---

Configuration lives in three layers. Everything you can change in the interface ends up in the
database; the environment only ever seeds it.

## The three layers

| Layer | Where | Read when |
|---|---|---|
| **Environment** | `.env`, prefix `SECONDTRACK_` | At import, into a cached settings object |
| **Runtime config** | The `settings` table, keys prefixed `cfg_` | At startup into an in-process cache, refreshed on save |
| **Plain settings** | The `settings` table, unprefixed keys | On every request that needs them |

The `settings` table is a flat key and value store, both text. There is no schema for it, which is
why a new setting never needs a migration.

## Which one wins

For anything with a `cfg_` key, the answer is: the database, always, once it has been written.

The defaults for the runtime layer are built from the environment at import. On startup each key is
looked up in the database, and only if it is absent does the environment default apply. Saving the
connection form writes the database key, and from then on the environment value is never consulted
again for that key.

The practical consequence: **editing `.env` after the first save changes nothing.** Change it in
the interface. The environment is there so a fresh container can come up already connected, not as
a way to steer a running one.

Two environment values behave differently because they have no interface equivalent:
`SECONDTRACK_SECRET_KEY` and `SECONDTRACK_COOKIE_SECURE` are read from the environment every time.
So are the three paths, `DB_PATH`, `UPLOAD_DIR` and `EXPORT_DIR`.

## The two admin variables

`SECONDTRACK_ADMIN_USER` and `SECONDTRACK_ADMIN_PASSWORD` are used exactly once: at startup, if the
users table is empty. Afterwards they are inert. Changing them does not change the login, and
resetting a forgotten password means editing the database or deleting the user row so the seed runs
again.

## Secrets

Tokens, API secrets and passwords are never rendered back into the form. The field shows a masked
placeholder and submits empty unless you type something, and an empty submit means keep the stored
value rather than clear it.

That is what makes it safe to save the WooCommerce tab without retyping the consumer secret. It
also means there is no way to clear a secret from the interface. To remove one, switch the
connection off, or clear the value in the database.

## When a change takes effect

| Change | Takes effect |
|---|---|
| Anything on a connection tab | Immediately, the cache is written on save |
| Hourly rate, currency, language | On the next page load |
| Style, wallpaper, dashboard | On the next page load |
| A path or the secret key in `.env` | On the next restart |

The runtime cache is per process, and the app is designed to run as a single uvicorn worker.
Running several workers gives each one its own cache, and a setting saved in one is not seen by the
others until they restart.

## Where to look things up

- [Environment variables](/reference/environment/) lists every `SECONDTRACK_` variable and what it
  seeds.
- [Settings keys](/reference/settings/) lists every key in the `settings` table, with its default
  and the page that writes it.
