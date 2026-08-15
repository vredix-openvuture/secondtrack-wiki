---
title: Expenses
description: Recording a purchase with its receipt, the three buckets, how it is mirrored into InvoiceNinja, the resync button, and creating a product from an expense.
sidebar:
  order: 1
---

An expense is a purchase with a receipt. It is the record that makes a cost real, which is why the
warehouse refuses to stock anything without one.

## Creating one

**A receipt is required.** PDF or image, up to 25 MB. Without one the form refuses to save. The
only route to stock with no expense is the free tick in the warehouse, which says the thing cost
nothing.

| Field | Notes |
|---|---|
| **Name** | What it was |
| **Amount** | Comma or dot as the decimal separator |
| **Date** | Defaults to today |
| **Vendor** | Free text. Becomes an InvoiceNinja vendor, created there if new |
| **Category** | Free text. Becomes an InvoiceNinja expense category, created there if new |
| **Allocation** | A project, or warehouse, or advertising |
| **Receipt** | Required |
| **Image** | Optional, a photo of the goods |

## The three buckets

| Bucket | Set when | Meaning |
|---|---|---|
| `project` | A project is picked | The cost belongs to that build |
| `warehouse` | Warehouse is picked, or the app created it while stocking | The cost sits in inventory until an item carries it out |
| `advertisement` | Advertising is picked, or promo merch was bought | Money spent on being seen |

Most expenses are created by the app rather than by hand: stocking a part, creating a lot or
handing merch over all produce one. See [The item that travels](/concepts/items/) for when an
expense follows an item onto a project and when it deliberately does not.

## The product image

A receipt scan says very little at thumbnail size, so the list shows the image of the product the
expense paid for, when there is one. A part beats a set on the same receipt, and the oldest wins
when several qualify.

The project column lists every project that holds a piece of this purchase, not just one. A ten
pack of fans can sit nine on one project and one on another, and the column says so.

## Mirroring into InvoiceNinja

When the connection is on, creating an expense also creates one in InvoiceNinja and attaches the
receipt to it as a document. The vendor and the category are looked up there by name and created if
missing. If the project is known, its name is appended to the notes.

Editing pushes the change. Deleting deletes it there too. All of it is best effort: an InvoiceNinja
failure never prevents the local record from being saved, because the receipt is the part you
cannot recreate.

An expense created while the connection was off has no InvoiceNinja id. Editing it later pushes it
for the first time.

## The resync button

For when expenses were wiped or edited on the InvoiceNinja side. The local rows still carry their
ids, so the normal push considers them already sent and skips them forever.

Resync checks every local expense against InvoiceNinja:

| There | Here |
|---|---|
| Gone | The id is cleared and the expense is created again |
| Present | It is updated to the local values |

The result says how many were created, updated and failed. One bad row does not stop the rest.
InvoiceNinja is treated as authoritative for whether a record exists, secondtrack for what is in
it.

## Creating a product from an expense

The expense form can create a warehouse part in the same step: give it a name, a sale value and a
note, and a part is created pointing at this expense, with the amount as its purchase price and the
uploaded image as its picture.

On an edit the same fields update that part rather than creating a second one, as long as exactly
one part points at the expense. If several do, or a set does, the fields are ignored, because there
is no single row to update.

## Archiving the receipt

With [Nextcloud](/integrations/nextcloud/) on, the receipt is uploaded when the expense is created
and again when the receipt is replaced:

```
<base>/Expenses/<year>/<MM - Month>/<ISO date>_<name>.<ext>
```

for example `/OpenVuture/Expenses/2026/08 - August/2026-08-15_Fan pack.pdf`. Failures are silent by
design: filing a copy must not prevent recording the expense.
