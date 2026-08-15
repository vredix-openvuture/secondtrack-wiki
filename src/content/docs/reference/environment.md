---
title: Environment variables
description: Every SECONDTRACK_ variable, its default, and whether it is read continuously or only used to seed a setting.
sidebar:
  order: 1
---

All variables are prefixed `SECONDTRACK_` and read from `.env` or the process environment. In
Docker, values injected by compose take precedence over the file, and a missing file is fine.

Most of them are **seeds**. They fill a database setting on first start, and after that the
database wins and editing the variable changes nothing. See
[How settings are stored](/concepts/settings-model/).

## Core

| Variable | Default | Read |
|---|---|---|
| `SECRET_KEY` | `dev-insecure-secret-change-me` | Always. Signs the session cookie |
| `ADMIN_USER` | `admin` | Once, if the users table is empty |
| `ADMIN_PASSWORD` | `changeme` | Once, likewise |
| `DB_PATH` | `./data/secondtrack.db` | Always |
| `CURRENCY` | `€` | Seeds the `currency` setting |
| `DEFAULT_HOURLY_RATE` | `45` | Seeds the `hourly_rate` setting |
| `COOKIE_SECURE` | `0` | Always. `1` restricts the session cookie to HTTPS |

:::caution
Change `SECRET_KEY`. Anyone who knows the shipped value can forge a session cookie for your
instance.
:::

## Paths

| Variable | Default | Read |
|---|---|---|
| `EXPORT_DIR` | `./data/exports` | Always. Point it at a mounted vault to export straight into Obsidian |
| `UPLOAD_DIR` | `./data/uploads` | Always. Created at startup and served at `/uploads` |

## WooCommerce

| Variable | Default | Seeds |
|---|---|---|
| `WOO_ENABLED` | `0` | `cfg_woo_enabled` |
| `WOO_URL` | empty | `cfg_woo_url` |
| `WOO_KEY` | empty | `cfg_woo_key` |
| `WOO_SECRET` | empty | `cfg_woo_secret` |
| `WOO_ORDER_STATUSES` | `processing,completed,on-hold` | `cfg_woo_order_statuses` |

The webhook, polling and fulfillment task settings have no environment equivalent. They exist only
in the interface.

## InvoiceNinja

| Variable | Default | Seeds |
|---|---|---|
| `INVOICENINJA_ENABLED` | `0` | `cfg_in_enabled` |
| `INVOICENINJA_URL` | empty | `cfg_in_url` |
| `INVOICENINJA_TOKEN` | empty | `cfg_in_token` |
| `INVOICENINJA_AUTO_SEND` | `0` | `cfg_in_auto_send` |

## Vikunja

| Variable | Default | Seeds |
|---|---|---|
| `VIKUNJA_ENABLED` | `0` | `cfg_vikunja_enabled` |
| `VIKUNJA_URL` | empty | `cfg_vikunja_url` |
| `VIKUNJA_TOKEN` | empty | `cfg_vikunja_token` |
| `VIKUNJA_PARENT_PROJECT` | `OpenVuture` | `cfg_vikunja_parent` |

## Nextcloud

| Variable | Default | Seeds |
|---|---|---|
| `NEXTCLOUD_ENABLED` | `0` | `cfg_nc_enabled` |
| `NEXTCLOUD_URL` | empty | `cfg_nc_url` |
| `NEXTCLOUD_USER` | empty | `cfg_nc_user` |
| `NEXTCLOUD_PASS` | empty | `cfg_nc_pass`. Use an app password |
| `NEXTCLOUD_BASE_PATH` | `/OpenVuture` | `cfg_nc_base_path` |
| `NEXTCLOUD_AUTO_ARCHIVE` | `0` | `cfg_nc_auto_archive` |

## eBay

| Variable | Default | Seeds |
|---|---|---|
| `EBAY_ENABLED` | `0` | `cfg_ebay_enabled` |
| `EBAY_CLIENT_ID` | empty | `cfg_ebay_client_id` |
| `EBAY_CLIENT_SECRET` | empty | `cfg_ebay_client_secret` |
| `EBAY_MARKETPLACE` | `EBAY_DE` | `cfg_ebay_marketplace` |

## No environment equivalent

Email and SMTP, the templates, the reminder and dunning intervals, the style, the wallpaper, the
dashboard, the language, the public base URL and the label printer all exist only as
[settings](/reference/settings/). They are configured in the interface.

## Checking what a running container has

```sh
docker compose exec secondtrack env | grep SECONDTRACK_ | sort
```

Remember that this shows what the process was given, not what it is using. For anything with a
`cfg_` key, the database is authoritative once the setting has been saved once.
