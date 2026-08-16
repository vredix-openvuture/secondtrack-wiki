---
title: Updating and removing
description: How an update behaves, what the startup migrations do to an existing database, how to back it up, and how to remove the installation completely.
sidebar:
  order: 4
---

## Updating

```sh
cd secondtrack
git pull
docker compose up -d --build
```

There is no separate migration command. Every schema change runs at startup, in
`init_db()`, and each step is written to be safe to run again. On an up-to-date database they all
find nothing to do and cost a few milliseconds.

:::caution
Back up the database first. The migrations are one-way: they add columns, rewrite legacy status
values and delete rows the new model no longer has a place for. A copy of `secondtrack.db` from
before the update is the only way back.
:::

```sh
docker compose stop secondtrack
cp /server/secondtrack/data/secondtrack.db /server/secondtrack/data/backup-$(date +%F).db
docker compose up -d
```

Copy it while the app is stopped. SQLite runs in WAL mode here, so a copy taken during a write can
miss what is still sitting in `secondtrack.db-wal`.

## What runs at startup

In order, every time the process starts:

| Step | What it does | Repeat-safe because |
|---|---|---|
| `create_all` | Creates any missing table | It only ever creates what is absent |
| `_ensure_columns` | Adds columns introduced after a release, via `ALTER TABLE ADD COLUMN` | It reads `PRAGMA table_info` first |
| Seed | Creates the admin user if the users table is empty, and the hourly rate and currency settings if unset | Both are guarded by a check |
| `_backfill_projects` | Gives a legacy project a number and a title | It skips any project that already has a number |
| `_remap_project_status` | Rewrites the old statuses to the new lifecycle | Only rows still holding an old value change |
| `_backfill_codes` | Gives older parts and sets a scan code, colours older categories, moves legacy per-column fields into the `extra` JSON | Each query filters on the value being NULL |
| `_default_font_fredoka` | Moves installs off the old `system` font default, once | A marker setting stops it running twice |
| `_migrate_devices_to_parts` | Turns each legacy device into a plain warehouse part on its project and deletes the device row | A second run finds no devices left |
| `_drop_placeholder_project_items` | Deletes the empty placeholder items the first cut of that migration created | A marker setting, plus a check that the row is empty in every respect |
| `_seed_project_types` | Creates the two starting project types and assigns one to projects that have none | It only creates what is missing |
| `_round_money_to_cents` | Rounds stored part, set and expense prices to the cent | The update only matches rows not already there |

The full list, with the columns each one adds, is in [Data model](/reference/data-model/).

## Assets after an update

Static files are served with a `?v=` token taken from the newest modification time under `static/`,
computed once at import. A rebuilt image therefore serves new URLs, and the service worker caches
under a version key built from the same token, so an old `app.js` cannot survive a deploy. If a
browser still shows stale styling, it is holding the page itself, not the assets: reload once.

## Removing it

```sh
docker compose down
docker image rm secondtrack-secondtrack
sudo rm -rf /server/secondtrack/data
```

The third command is the one that actually removes your data: the database, every uploaded image
and receipt, and the exports. Nothing lives anywhere else.

What is **not** removed, because it was never secondtrack's:

- Invoices, expenses and clients in InvoiceNinja.
- Tasks and boards in Vikunja.
- Files already archived into Nextcloud.
- Orders and products in WooCommerce.

That is the trade the [one home per fact](/concepts/one-home/) rule makes. Removing the cockpit
leaves the business records untouched, and it also means uninstalling does not clean them up for
you.
