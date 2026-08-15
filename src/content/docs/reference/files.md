---
title: Files and paths
description: What lives where, in the container and in the repository, and which paths leave the machine.
sidebar:
  order: 5
---

## Runtime data

Everything the application writes is under one directory, mounted as `/data`.

| Path | What it is | Configurable with |
|---|---|---|
| `/data/secondtrack.db` | The database | `SECONDTRACK_DB_PATH` |
| `/data/secondtrack.db-wal`, `-shm` | SQLite's write-ahead log and shared memory | |
| `/data/uploads/` | Every image and receipt, served at `/uploads` | `SECONDTRACK_UPLOAD_DIR` |
| `/data/exports/` | Markdown exports | `SECONDTRACK_EXPORT_DIR` |

Nothing is written outside it. Copying that directory copies the installation.

The WAL files matter for backups: copy the database while the application is stopped, or a copy
taken during a write can miss what is still sitting in the log.

### Upload filenames

`<prefix>-<16 hex characters><extension>`, where the prefix says what it belongs to.

| Prefix | From |
|---|---|
| `part` | A part or a set member |
| `set` | A set |
| `proj` | A project gallery photo |
| `project` | A project's own image |
| `expense` | The product photo on an expense |
| `receipt` | A receipt |
| `wallpaper` | The wallpaper |
| `dashlogo` | The dashboard logo |

The name carries no meaning beyond the prefix. The link is the path stored in the database, which
is why deleting a row also deletes its file, and why a file with no row is invisible.

## In the container

| Path | What |
|---|---|
| `/app/app/` | The application package |
| `/app/templates/` | Jinja templates |
| `/app/static/` | CSS, JavaScript, fonts, icons |
| `/data/` | The volume above |

The image is `python:3.12-slim` plus `cups-client`, for the label print button.

## In the repository

| Path | What |
|---|---|
| `app/main.py` | Application setup, the routers, the background jobs |
| `app/config.py` | The environment settings object |
| `app/runtime.py` | The `cfg_` layer and its defaults |
| `app/db.py` | Engine, session, settings helpers, every migration |
| `app/models.py` | The ORM model |
| `app/auth.py` | Password hashing, the login dependency |
| `app/i18n.py` | The translation table |
| `app/templating.py` | Jinja setup, filters, the base context |
| `app/routers/` | One module per area |
| `app/services/` | Domain logic: finance, warehouse, codes, hub, expenses, markdown, mdrender, emails, mailer, uploads, printing |
| `app/services/integrations/` | One module per external system, and the only place that speaks HTTP to it |
| `templates/` | The pages |
| `static/` | Assets, the service worker, the manifest |
| `docs/img/` | README screenshots and their shotlist |
| `assets/icons/` | The wordmark and the link buttons |

## Nextcloud

Written under the base path, `/OpenVuture` by default.

| What | Path |
|---|---|
| Invoice | `<base>/Invoices/<year>/<month>/<number>_<customer>.pdf` |
| Deleted invoice | `<base>/Invoices/<year>/<month>/deleted/<same name>` |
| Receipt | `<base>/Expenses/<year>/<MM - Month>/<ISO date>_<name>.<ext>` |

See [Nextcloud](/integrations/nextcloud/).

## What leaves the machine

| Destination | What goes there |
|---|---|
| InvoiceNinja | Invoices, expenses, receipt documents, client details |
| WooCommerce | Nothing. Orders are only read |
| Vikunja | Fulfillment tasks with the customer's shipping address, plus task edits |
| Nextcloud | Invoice and receipt files |
| eBay | The part name you asked a price for |

Nothing else is sent anywhere. There is no telemetry, no update check and no external asset, with
one exception: the base template loads htmx from `unpkg.com`, so a page load reaches that CDN.
