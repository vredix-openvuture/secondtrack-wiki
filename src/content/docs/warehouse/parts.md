---
title: Parts
description: Creating, editing, booking, moving, splitting and deleting stock, including the receipt rule and how quantities behave.
sidebar:
  order: 2
---

A part is one row of stock. It may be a single object or a quantity of identical ones, and its
prices are always per unit.

## Creating one

Warehouse, New. The fields, in the order they matter:

| Field | Notes |
|---|---|
| **Name** | The only required field |
| **Purchase price** | Entered as a total for the quantity, stored per unit |
| **Sale price** | The same. This is what the item contributes when it goes into a build |
| **Quantity** | Defaults to 1 |
| **Receipt** | Required, see below |
| **Free** | Ticking it means no purchase, no receipt, no expense |
| **Category** | Supplies the extra fields and the code prefix |
| **Supplier**, **Location**, **Condition** | Optional |
| **Merch** | Puts it in the merch department |
| **Image** | Compressed to WebP, longest edge 1600 pixels |
| **Note** | Free text |

Category fields and the global optional fields appear as extra inputs once a category is picked.
See [Categories and fields](/warehouse/categories/).

### The receipt rule

Every purchase needs a receipt, as a PDF or an image, and the form refuses to save without one.
There are exactly two ways around it:

- **Tick free.** No cost, no expense, nothing to document.
- **Link an existing receipt.** The dropdown lists the last 100 expenses that carry a receipt file.
  The part points at that expense and no second one is created, which is the right answer when one
  invoice covers several things you are stocking one at a time.

Otherwise an [expense](/money/expenses/) is created in the `warehouse` bucket with the receipt
attached, and the part points at it. Merch without a sale price goes into the `advertisement`
bucket instead, because promo material is an advertising cost from the moment it is bought.

## Editing

The edit dialog mirrors the create form, minus the receipt. Prices there are per unit, not totals.
Changing the purchase price to nothing turns the part from bought into harvested, which is the
right state for something pulled out of a machine: real resale value, no cost of its own.

An edit never touches the linked expense. To correct what a purchase cost, edit the
[expense](/money/expenses/).

## Booking onto a project

Two routes, same result:

- **From the warehouse**, with the book button: pick a project, a quantity, and whether it is sold
  with the build or handed over free.
- **From the project**, with the assign field: pick the item from the list of everything on the
  shelf.

Booking fewer units than are in stock splits the row. What happens to the receipt is on
[The item that travels](/concepts/items/), and it is worth reading before the first split, because
that is where the surprises are.

## The other actions

| Action | What it does |
|---|---|
| **Move** | Changes the storage location |
| **Merch** | Moves the row between the parts and merch departments |
| **Split** | Turns one part into a lot, see [Lots and finished goods](/warehouse/sets/) |
| **Price** | Asks eBay for a suggestion, see [eBay](/integrations/ebay/) |
| **Label** | Opens the printable label, see [Codes, labels and scanning](/warehouse/codes-labels/) |
| **Delete** | Removes the row. Only possible while it is not on a project |

Deleting a part does not delete its expense. The receipt documents a purchase that happened, and
that stays true whether or not you still hold the goods.

## Condition and the optional fields

Condition is a fixed list: new, used, refurbished, defective. It is a plain string with no
behaviour attached, shown on the row and on the label subtitle.

The seven optional fields are global, apply to every product, and are edited in Settings,
Categories:

| Field | Type |
|---|---|
| Serial number | text |
| MPN | text |
| EAN | text |
| Unit | text |
| Reorder level | number |
| Purchase date | date |
| Warranty until | date |

Reorder level is the one with behaviour: a product at or below it counts as low stock, is marked in
the list and can be filtered for. An empty reorder level means no alert, which is different from
zero.
