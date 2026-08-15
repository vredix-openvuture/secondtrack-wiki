---
title: Merch
description: The department for stickers, shirts and cases, the difference between promo material and stock, and what a free handover does to a project's numbers.
sidebar:
  order: 4
---

Merch is stock you hand out or sell alongside a build, rather than something you build with:
stickers, shirts, hoodies, cases. It is stocked like any other part, with a receipt, a quantity, a
category and a location. It gets its own department because it is counted differently.

## Promo material or stock

The sale price decides, at the moment of purchase.

| Sale price | It is | Its purchase goes to |
|---|---|---|
| Zero or empty | Promo material, made to be handed out | The `advertisement` expense bucket |
| Set | Normal stock, sold like anything else | The `warehouse` bucket |

An item with no sale price is not stock waiting to be sold, because nothing is waiting: it exists
to be given away. Booking its purchase as advertising immediately is the honest place for that
money, rather than parking it in inventory it will never leave as a sale.

A part can be moved between the parts and merch departments at any time with the merch button. The
bucket of the expense created at purchase does not change retroactively.

## Handing something over

The handout button on a merch row asks for three things: a project, a quantity, and how it goes
out.

| Handed over | On the project |
|---|---|
| **Sold** | Behaves like any part. Its cost is material cost, its sale price is value |
| **Free** | Billed at zero, contributes no material cost and no value. Its purchase price appears as advertising cost |

A free handover also leaves the purchase expense where it is, because the money was spent on
advertising and not on that build. See [The item that travels](/concepts/items/).

The same choice exists on the project's own assign field, as a free tick next to the quantity, so
you can add a sticker to a build without going back to the warehouse.

## Where the money shows up

| Place | What it says |
|---|---|
| Merch department | The stock value of merch on the shelf, and the total already given away |
| Project summary | Advertising cost, as its own line next to material cost |
| Statistics | Advertising cost across every project |
| Invoice | The line item at 0, with the note "Gratis", so the customer sees why it is free |

Advertising cost has its own line everywhere for one reason: a giveaway has left the shelf and is
no longer material cost anywhere, so without a figure of its own that money would disappear from
the totals entirely.

## Coming back

Removing a handed-over item from a project clears its giveaway flag. On the shelf it is stock
again, not a record of a handover, so booking it out later starts from a clean choice.
