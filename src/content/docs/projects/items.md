---
title: Items on a project
description: Assigning parts and sets from the warehouse, changing booked quantities, handing something over free, releasing items, and linking expenses.
sidebar:
  order: 2
---

A project holds items, and every one of them came from the warehouse. There is no way to create an
item on a project, and that is deliberate: an item that skipped the warehouse would have no
receipt, no code and no place on a shelf when it comes back.

## Assigning

The assign field lists everything currently on the shelf, parts and sets alike, each with its code
next to its name. Pick one, give a quantity, and optionally tick free.

| You picked | What happens |
|---|---|
| A part, whole quantity | The row moves onto the project, its expense follows if it can |
| A part, fewer units | The row splits. The remainder stays on the shelf, the receipt stays with it |
| A set | It moves with all its members, and its expense follows if it has no project yet |

The **New** button next to the field is a shortcut, not an exception: it opens the warehouse create
dialog with the project attached, and the finished item is sent straight back here.

What happens to the receipt in each case is on [The item that travels](/concepts/items/). When it
stays behind, the message after the assignment says so.

## Quantities

The quantity on a booked item can be changed at any time.

| New quantity | Effect |
|---|---|
| Lower | The difference goes back to the shelf row it came from, or a new shelf row if that one is gone |
| Higher | The difference is taken from the shelf row, capped by what is actually in stock |
| Zero | The item is released entirely |

Prices are per unit throughout, so three of a 4.00 part cost the project 12.00 and are worth three
times its sale price.

## Handing something over free

The free tick bills the item at nothing. It contributes no material cost and no value to the
project, and its purchase price appears as advertising cost instead. The purchase expense stays
where it is, because that money was spent on advertising rather than on this build.

On the invoice it appears as a line at 0 with the note "Gratis", so the customer sees why something
on the document costs nothing. See [Merch](/warehouse/merch/).

## Releasing

Removing an item sends it back to the shelf. Two things change on the way:

- The giveaway flag is cleared. It is stock again, not a record of a handover.
- An item marked as bought but with no purchase price becomes harvested, which is the correct state
  for a part pulled out of a machine.

Releasing a set sends the whole set back, members included.

## What the list shows

The item list is the same list the calculation, the Markdown export and the invoice use. Those four
cannot disagree about what is on the project, because there is only one of them.

A set appears as a single row at the set price, and its members are skipped. Billing both would
charge the same purchase twice.

## Expenses

Two ways an expense ends up on a project:

- **It followed an item**, as described above.
- **You booked it**, with the assign-expense field, which lists the last 100 expenses that are not
  yet on any project.

The project page lists every expense pointing at it. Booking one is a link, not a move: it stays in
the expense list, and its bucket becomes `project`. See [Expenses](/money/expenses/).
