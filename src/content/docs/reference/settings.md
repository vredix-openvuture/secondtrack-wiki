---
title: Settings keys
description: Every key in the settings table, its default, the page that writes it, and what it does.
sidebar:
  order: 2
---

The `settings` table is a flat key and value store, both columns text. Keys prefixed `cfg_` are the
runtime configuration, cached in the process and refreshed on save. Everything else is read per
request.

Values shown here are the defaults. Booleans are stored as `"1"` and `"0"`.

## General

| Key | Default | Written by |
|---|---|---|
| `hourly_rate` | From `DEFAULT_HOURLY_RATE`, 45 | Settings, General |
| `currency` | From `CURRENCY`, `€` | Settings, General |
| `language` | `en` | Settings, General |
| `public_base_url` | empty | Settings, General |
| `label_print_host` | empty | Settings, General |
| `label_print_queue` | empty | Settings, General |
| `label_print_media` | `w144h72` when empty | Settings, General |

## Style

| Key | Default | Range |
|---|---|---|
| `accent` | `#fb6734` | Hex |
| `accent2` | `#ce3737` | Hex |
| `style_bg` | `#26121b` | Hex |
| `style_radius` | `10` | 0 to 28 |
| `style_font` | `fredoka` | fredoka, system, mono, serif, rounded |
| `style_density` | `comfortable` | comfortable, compact |
| `style_glass` | `0` | |
| `style_card_opacity` | `100` | 40 to 100 |
| `style_sidebar` | `closed` | open, closed |
| `wallpaper_path` | empty | An `/uploads/` path |
| `wallpaper_blur` | `0` | 0 to 40 |
| `wallpaper_dark` | `40` | 0 to 95 |

## Dashboard

| Key | Default |
|---|---|
| `dashboard_widgets` | `welcome:4,finance:2,projects:2,warehouse:1,invoices:1,orders:2,tasks:1,quick:2,scan:1` |
| `dashboard_layout` | empty. JSON of `{key: {x, y, w, h}}` |
| `dashboard_logo` | empty |

## Warehouse

| Key | Default |
|---|---|
| `optional_fields_json` | Unset, which means the seven seeded optional fields apply |

## Connections, prefixed `cfg_`

### WooCommerce

| Key | Default |
|---|---|
| `woo_enabled` | From the environment |
| `woo_url`, `woo_key`, `woo_secret` | From the environment |
| `woo_order_statuses` | `processing,completed,on-hold` |
| `woo_webhook_enabled` | `0` |
| `woo_webhook_secret` | empty |
| `woo_poll_enabled` | `0` |
| `woo_poll_interval` | `5`, in minutes, minimum 1 |
| `woo_poll_since` | empty. The watermark, set when polling is first enabled |
| `woo_task_enabled` | `1` |
| `vikunja_order_board` | `customers` |

### InvoiceNinja

| Key | Default |
|---|---|
| `in_enabled`, `in_url`, `in_token` | From the environment |
| `in_auto_send` | From the environment |

### Vikunja

| Key | Default |
|---|---|
| `vikunja_enabled`, `vikunja_url`, `vikunja_token` | From the environment |
| `vikunja_parent` | `OpenVuture` |

### Nextcloud

| Key | Default |
|---|---|
| `nc_enabled`, `nc_url`, `nc_user`, `nc_pass` | From the environment |
| `nc_base_path` | `/OpenVuture` |
| `nc_auto_archive` | From the environment |

### eBay

| Key | Default |
|---|---|
| `ebay_enabled`, `ebay_client_id`, `ebay_client_secret` | From the environment |
| `ebay_marketplace` | `EBAY_DE` |

## Email, prefixed `cfg_`

| Key | Default |
|---|---|
| `email_provider` | `secondtrack`, or `invoiceninja` |
| `email_enabled` | `0` |
| `smtp_host` | empty |
| `smtp_port` | `587` |
| `smtp_user` | empty |
| `smtp_pass` | empty |
| `smtp_security` | `tls`, or `ssl`, or `none` |
| `mail_from_name` | `secondtrack` |
| `mail_from_email` | empty |
| `email_auto` | `0` |
| `reminder_days` | `0` |
| `dunning_days` | `30` |

### Templates

| Key | Default |
|---|---|
| `tpl_invoice_subject` | `Invoice {number}` |
| `tpl_invoice_body` | A short covering note |
| `tpl_reminder_subject` | `Payment reminder for invoice {number}` |
| `tpl_reminder_body` | A friendly reminder |
| `tpl_dunning_subject` | `Overdue notice for invoice {number}` |
| `tpl_dunning_body` | A firmer notice |
| `tpl_receipt_subject` | `Your receipt {number}` |
| `tpl_receipt_body` | A thank you with the receipt attached |

Placeholders: `{client}`, `{number}`, `{amount}`, `{due_date}`, `{link}`, `{company}`. An unknown
placeholder renders as empty. The receipt pair is not exposed in the interface.

## Written by the application

Not user-facing. Listed because they appear in the table and because deleting one has consequences.

| Key | What it holds |
|---|---|
| `nc_archive_index` | JSON of `{invoice id: {ver, path}}`. What has been uploaded to Nextcloud and where |
| `nc_archived_invoice_ids` | The same ids as a flat list, for the per-row sync mark in the hub |
| `nc_archived_versions` | Legacy, migrated into `nc_archive_index` on first read |
| `placeholder_items_dropped` | Marker so the placeholder cleanup migration runs once |
| `style_font_default_v2` | Marker so the Fredoka default is applied once |

Deleting `nc_archive_index` makes the next sync re-upload every paid invoice. Deleting a migration
marker makes that migration run again on the next start.

## Reading them directly

```sh
docker compose exec secondtrack \
  python -c "import sqlite3;print(sorted(sqlite3.connect('/data/secondtrack.db').execute('select key from settings')))"
```
