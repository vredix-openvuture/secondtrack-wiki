---
title: The item that travels
description: How one stock row moves from a receipt to a shelf to a build and into an invoice, carrying its cost, and what happens to the receipt on the way.
sidebar:
  order: 2
---

The central idea of the warehouse is that an item is one row that moves. It is bought once, sits on
a shelf, goes into a build, and is billed at the end. Its purchase price travels with it the whole
way, which is what makes the profit on a project a number rather than an estimate.

## Where an item can be

A part has two nullable links that decide where it is.

| `project_id` | `set_id` | Where it is |
|---|---|---|
| NULL | NULL | Loose on the shelf |
| NULL | a lot | On the shelf, part of a purchase lot, still available |
| NULL | an assembly | Consumed into a build, no longer available separately |
| a project | either | On that project |

`device_id` also exists and is always NULL on anything created today. It belonged to the device
model that [was migrated away](/start/update-remove/).

## The path of one item

1. **Bought.** You create it with a receipt. The app creates an [expense](/money/expenses/) in the
   `warehouse` bucket, attaches the receipt to it, and links the part to that expense through
   `source_expense_id`.
2. **Stored.** It gets a [scan code](/warehouse/codes-labels/) and, if you set one, a location.
3. **Booked.** Assigning it to a project sets `project_id`. Its resale value now counts towards the
   project's value, and its purchase price towards the project's material cost.
4. **Billed.** The invoice bills it at its sale price. A set is billed once, at the set price, and
   its members are not billed separately.

## What happens to the receipt

The expense moves with the item, but only when moving it cannot mislead.

| Situation | The expense |
|---|---|
| The whole row is booked and the receipt covers only this item | Moves onto the project, bucket becomes `project` |
| Part of the quantity is booked | Stays in the warehouse. One receipt for ten units must not land whole on the project that took three |
| The receipt also covers other parts or a set | Stays in the warehouse, for the same reason |
| The item is handed over free | Stays where it is. A gift is an advertising cost, not a cost of that build |
| The expense is already on another project | Stays there |

When the expense stays behind, the interface says so in the message after the booking. The item is
still on the project and still counted; only the receipt document did not move.

## Quantities

Prices are per unit. A row with ten units at 4.00 is worth 40.00.

Booking fewer units than are in stock splits the row: a new row with the booked quantity is created
on the project, the shelf row keeps the remainder. Changing the booked quantity on the project
moves units back and forth between the two rows, and the shelf row is recreated if it has since
been deleted. Booking zero releases the item entirely.

The split copies everything about the product, and deliberately not the giveaway flag, because that
describes how one particular handover happened, not what the product is.

## Coming back

Removing an item from a project sets `project_id` back to NULL. Two things change on the way back:

- The giveaway flag is cleared. Back on the shelf it is stock again, not a handout.
- If it was marked as purchased but has no purchase price, it becomes harvested. That is the
  state for a part pulled out of a machine: real resale value, no cost of its own.

Deleting a project does the same for everything on it. Items are released to the warehouse rather
than deleted with the project, and expenses booked on it keep their receipt and fall back to the
warehouse bucket.

## Sets swallow their members

A [set](/warehouse/sets/) on a project counts as one item at its own price, and its members are
skipped entirely. Without that rule a purchase lot would be billed twice: once as the lot, once as
the parts inside it. The same list of items feeds the project page, the calculation, the Markdown
export and the invoice, so those four can never disagree about what is on the project.
