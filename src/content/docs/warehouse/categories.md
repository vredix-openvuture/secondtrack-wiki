---
title: Categories and fields
description: Defining product categories with their own fields, the five field types, the seven global optional fields, and what happens to values when a schema changes.
sidebar:
  order: 5
---

A category is a product class: CPU, drive, mainboard, cable. Beyond grouping and colouring the
list, it does two things: it gives its parts extra fields of your choosing, and it supplies the
first three characters of their [scan codes](/warehouse/codes-labels/).

Categories are managed in **Settings, Categories**.

## What a category has

| Field | Notes |
|---|---|
| **Name** | Unique. Its first three alphanumeric characters become the code prefix, so "CPU" gives `CPU-3K7Q` |
| **Icon** | A short string, usually one emoji, shown on the card |
| **Colour** | A hex colour for the card glow and the table tag. Assigned automatically from a palette of eight if you leave it empty |
| **Position** | The order in the list |
| **Fields** | The category's own field schema |

Deleting a category unlinks its parts rather than deleting them. Their stored attribute values stay
in the row, harmlessly orphaned, and reappear if the part is put back into a category using the
same field keys.

## The field schema

Each field has a key, a label, a type, an optional unit, an optional list of options and a required
flag.

| Type | Input | Stored as |
|---|---|---|
| `text` | A text box | String |
| `number` | A number box | Integer if it is whole, otherwise a float. Commas are accepted as decimal separators |
| `select` | A dropdown of your options | The chosen string |
| `bool` | A checkbox | true or false |
| `date` | A date picker | The string as submitted |

The key is derived from the label: lowercased, non-alphanumerics turned into underscores,
de-duplicated with a numeric suffix. Providing a key explicitly keeps it, which is what preserves
the link to values already stored on parts. **Renaming a label keeps the key and keeps the values.
Changing the key orphans them.**

Values live on the part as a JSON object under `attributes`, keyed by field key. Empty values are
dropped rather than stored as empty strings, so a part only carries what was actually filled in.

## The global optional fields

Seven fields apply to every product regardless of category, and are edited on the same settings
page. They are stored separately, under `extra` on the part.

| Field | Key | Type |
|---|---|---|
| Serial no. | `serial_no` | text |
| MPN | `mpn` | text |
| EAN | `ean` | text |
| Unit (pcs, m…) | `unit` | text |
| Reorder level | `min_stock` | number |
| Purchase date | `purchase_date` | date |
| Warranty until | `warranty_until` | date |

The list itself is editable with the same schema editor: fields can be renamed, retyped, added and
removed. Two keys carry behaviour and should keep their names:

- `min_stock` drives the low stock marker and filter.
- The rest are display only.

The seven above are the seeded default. Once you save the list, your version is stored and the
default is no longer consulted.

## Where the values show up

| Place | Shows |
|---|---|
| The part row | Category tag in the category colour |
| The part detail | Every filled field in category order, with its unit appended |
| The edit dialog | Every field of the current category, plus the seven global ones |
| The label | Not the fields. A label carries the code, the name and the location |

Switching a part to a different category leaves the old values in the row but stops displaying
them, since display walks the new category's schema. Switching back brings them into view again.
