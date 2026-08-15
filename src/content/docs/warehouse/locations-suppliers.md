---
title: Locations and suppliers
description: The storage location tree, how filtering and deleting behave in it, and the supplier records parts can point at.
sidebar:
  order: 6
---

## Storage locations

A location is a physical place: a room, a rack, a shelf, a bin. They nest, each one pointing at its
parent, and the tree is edited under **Warehouse, Locations**.

| Field | Notes |
|---|---|
| **Name** | Required |
| **Parent** | Empty makes it a root |
| **Note** | Free text |
| **Code** | Assigned automatically with the `LOC` prefix |

The full path is rendered as a breadcrumb, `Workshop › Rack A › Shelf 2`, and is what appears under
the name on a label and on a part row.

### Filtering includes children

Filtering the warehouse by a rack includes everything on its shelves and in its bins. That is
usually what you mean by "show me what is in that rack", and it is the reason picking a top-level
room is a useful filter rather than an empty one.

### Deleting

Deleting a location does not delete anything inside it. Its children are re-parented one level up,
and every part and set stored in it moves to its parent. Deleting a root location therefore leaves
its contents with no location at all, which is recoverable but easy to miss.

A location cannot be made a descendant of itself. The parent dropdown accepts the value but the
save is ignored, because applying it would detach the whole subtree from the tree.

### Labels

Every location has a scan code and a printable label like any other object. Scanning a location
label opens the location tree with that location highlighted. That is the intended use: a label on
the front of every bin, and a phone camera instead of a memory.

## Suppliers

A supplier is a place you buy from. The record is a plain address book entry, edited under
**Warehouse, Suppliers**, with no behaviour beyond being selectable on a part and filterable in the
list.

| Field |
|---|
| Name (required) |
| Contact person |
| Email |
| Phone |
| Website |
| Address |
| Your account number with them |
| Note |

The list shows how many parts point at each supplier. Deleting one unlinks those parts rather than
deleting them.

Supplier is not the same as the vendor on an [expense](/money/expenses/). The expense vendor is a
free-text field that is mirrored into InvoiceNinja, where it becomes an InvoiceNinja vendor. The
supplier here is local, structured, and exists so you can answer "where did I buy this and what is
my account number there".
