---
title: Data model
description: Every table and column, what NULL means in each one, and the legacy fields that are still there.
sidebar:
  order: 4
---

SQLite, in WAL mode, with foreign keys on. One file, at `SECONDTRACK_DB_PATH`.

## users

One row. See [Account, keys and the app](/ui/app/).

| Column | Notes |
|---|---|
| `id`, `username` | Unique |
| `display_name` | Shown in the greeting |
| `password_hash` | bcrypt |
| `totp_secret`, `totp_enabled` | Two-factor |
| `created_at` | |

## projects

| Column | Notes |
|---|---|
| `id`, `name`, `title` | `title` came with the container rework and mirrors `name` |
| `number` | `PJ-YYYYMMDD-XXXX`, unique |
| `customer_id` | Nullable |
| `type_id` | Nullable, points at `project_types` |
| `description`, `image_path` | |
| `status` | `open`, `in_progress`, `done`, `invoiced`, plus the legacy `in_production`, `archived`, `sold` |
| `kind` | **Legacy.** `customer` or `shop`, superseded by `type_id` |
| `purchase_price` | **Legacy.** Only counted while the project has no items |
| `sale_price` | The list price. NULL means use the suggestion |
| `hourly_rate` | NULL means the global rate |
| `woo_product_id` | Set only by the migration from devices |
| `invoiceninja_id` | The invoice raised from this project |
| `vikunja_task_id` | A linked task |
| `created_at`, `archived_at` | `archived_at` is stamped on done or invoiced, cleared on reopening |

## parts

The busiest table. Warehouse means `project_id` and `device_id` are both NULL.

| Column | Notes |
|---|---|
| `id`, `name`, `notes`, `image_path` | |
| `project_id` | NULL means on the shelf |
| `device_id` | **Legacy.** Always NULL on anything created today |
| `set_id` | Its lot or assembly |
| `source_expense_id` | The purchase it came from |
| `category_id`, `supplier_id`, `location_id` | All nullable |
| `code` | The scan code, unique |
| `attributes` | JSON of the category's field values |
| `extra` | JSON of the global optional field values |
| `origin` | `purchased` or `harvested` |
| `condition` | `new`, `used`, `refurbished`, `defective` |
| `serial_no`, `mpn`, `ean`, `unit`, `min_stock`, `purchase_date`, `warranty_until` | **Legacy columns.** Migrated into `extra`, still read as a fallback |
| `purchase_price` | Per unit. NULL for a harvested part |
| `quantity` | Units in this row |
| `sale_price` | Per unit |
| `is_merch` | Puts it in the merch department |
| `giveaway` | This booking was handed over free |
| `created_at`, `updated_at` | |

Derived properties: `in_warehouse`, `attrs`, `extras`, `is_promo` (merch with no sale price),
`low_stock` (quantity at or below the reorder level).

## sets

Both kinds live here.

| Column | Notes |
|---|---|
| `id`, `name`, `image_path`, `notes` | |
| `kind` | `purchase_lot` or `assembly` |
| `status` | `wip` or `finished`, meaningful only for an assembly |
| `sellable` | Ready to sell |
| `purchase_price` | A lot's total, or an assembly's computed component cost |
| `sale_price` | Nullable |
| `expense_id` | The purchase, for a lot |
| `condition`, `code`, `location_id` | |
| `source_project_id` | Where an assembly came from. Never changes |
| `project_id` | Where it is now. NULL means on the shelf |
| `created_at` | |

## categories

| Column | Notes |
|---|---|
| `id`, `name` | Unique. Its first three characters become the code prefix |
| `icon`, `color`, `position` | |
| `fields_json` | The field schema, an ordered JSON list |

## suppliers

`id`, `name`, `contact`, `email`, `phone`, `website`, `address`, `account_no`, `notes`,
`created_at`.

## storage_locations

| Column | Notes |
|---|---|
| `id`, `name`, `notes`, `code` | |
| `parent_id` | NULL makes it a root |

`path` renders the breadcrumb and guards against cycles.

## customers

| Column | Notes |
|---|---|
| `id`, `name`, `email`, `company` | |
| `kind` | `internal` or `invoiceninja` |
| `invoiceninja_client_id` | Set for the second kind |

## work_sessions

`id`, `project_id`, `work_date`, `description`, `hours`, `hourly_rate` (NULL means fall back),
`created_at`.

## expenses

| Column | Notes |
|---|---|
| `id`, `name`, `amount`, `expense_date` | |
| `vendor`, `description`, `category` | Mirrored into InvoiceNinja |
| `bucket` | `project`, `warehouse` or `advertisement` |
| `project_id` | Set when the bucket is `project` |
| `receipt_path` | The receipt file |
| `image_path` | An optional photo of the goods |
| `invoiceninja_id` | NULL means never pushed |

## order_invoices

The link table. See [One home per fact](/concepts/one-home/).

| Column | Notes |
|---|---|
| `source` | `woo` or `project` |
| `woo_order_id` | Unique. This is what prevents a second invoice per order |
| `project_id`, `customer_id` | |
| `vikunja_task_id` | The fulfillment task |
| `invoiceninja_id`, `invoice_number`, `amount`, `status` | Cached for display |
| `emailed_at`, `reminder_sent_at`, `dunning_sent_at` | Each stage sends once |

## project_images and reports

`project_images`: `id`, `project_id`, `path`, `caption`, `created_at`. Deleting a row deletes the
file.

`reports`: `id`, `project_id`, `title`, `body_md`, `created_at`.

## project_types

`id`, `name` (unique), `shop_stock`, `position`. Two are seeded: Customer order and Shop production.

## settings

`key`, `value`, both text. See [Settings keys](/reference/settings/).

## devices

**Legacy, and emptied by the migration.** The class survives only so that migration can still read
an old database. A device is turned into a plain warehouse part on its project and the row is
deleted.

## Migrations

They all run at startup and are all safe to repeat. The full list, in order, is on
[Updating and removing](/start/update-remove/).

Columns added by `_ensure_columns`, by table:

| Table | Columns |
|---|---|
| `projects` | `image_path`, `vikunja_task_id`, `kind`, `number`, `title`, `customer_id`, `type_id` |
| `parts` | `image_path`, `device_id`, `source_expense_id`, `set_id`, `quantity`, `category_id`, `supplier_id`, `location_id`, `code`, `attributes`, `condition`, `serial_no`, `mpn`, `ean`, `warranty_until`, `purchase_date`, `min_stock`, `unit`, `extra`, `is_merch`, `giveaway` |
| `categories` | `color` |
| `sets` | `kind`, `status`, `sellable`, `condition`, `notes`, `code`, `location_id`, `source_project_id`, `project_id` |
| `users` | `display_name` |
| `work_sessions` | `hourly_rate` |
| `order_invoices` | `reminder_sent_at`, `dunning_sent_at`, `customer_id`, `vikunja_task_id` |
| `expenses` | `image_path`, `name`, `bucket` |
