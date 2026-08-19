---
title: Lots and finished goods
description: The two kinds of set, how a lot splits one receipt across its members, how a build is assembled from stock, and how a project becomes shop stock.
sidebar:
  order: 3
---

A set groups parts. There are two kinds, and they behave in opposite directions: a lot is one
purchase broken into products, an assembly is several products combined into one.

| Kind | Direction | Members are |
|---|---|---|
| **Purchase lot** | One receipt, several products | Still available individually |
| **Assembly** | Several products, one object | Consumed into the build |

## Purchase lots

You bought a bundle: one invoice, one price, five usable parts. The lot holds the total, because
giving each member its own purchase price would count the same invoice several times over.

The total is split across the members proportionally to their sale value, so the part you can sell
for the most carries the largest share of what you paid. If no member has a sale value, the split
is equal. The last member absorbs the rounding difference, so the shares always add up to the total
exactly.

A member row is a full product, not just a name. It carries its own category with that category's
fields, condition, supplier, location, quantity, image and note, exactly like a part created on its
own.

### What a lot is worth

A lot is broken up and its parts are sold individually, so it has no sale price of its own. The
figure on its card and in its row is the **item value**: what the parts inside it are worth
together. Its purchase total sits next to it, which is the pair worth reading, what it cost against
what is in it.

A finished good is the other way round and does show a sale price, because it is the thing being
sold.

### Creating one

Warehouse, Sets, New. The lot needs a name, the total price, a receipt and its member rows. As with
a single part, the receipt can be replaced by ticking free.

There are two other ways a lot comes into being:

- **Splitting a part.** A part that turned out to be several things becomes a lot: give the member
  rows, and the original row is absorbed. The total defaults to what the part cost.
- **Converting on creation.** The create dialog can take an existing part as its seed, inheriting
  its receipt, image and location before deleting it.

### Editing one

The edit dialog changes the name, the total, the location, the note, the image and the receipt, and
can add further members. Members added after the fact carry no purchase price of their own: the lot total
stays at set level, which is where the one invoice belongs. Changing the lot's location moves every
member with it.

### The receipt behind a lot

A lot's cost is documented by one expense, and the edit dialog can attach, replace or re-point it:

| Choice | Does |
|---|---|
| **Keep current receipt** | Nothing. Offered only when there is one |
| **Upload new receipt** | Replaces the file on the lot's expense, or creates the expense if the lot was stocked as free |
| **Use existing receipt** | Points the lot, and its members, at a purchase that is already booked |

The expense amount follows the lot total, so correcting the total here no longer leaves the receipt
claiming the old one. Saving without touching the control leaves the receipt exactly as it was.

## Assemblies

An assembly is a build. It starts empty and gains components, and its cost is recomputed from those
components every time one is added or removed: the sum of each component's purchase price times its
quantity.

| Status | Means | Sellable |
|---|---|---|
| **WIP** | Still being built | No |
| **Finished** | Done | Yes |

Booking a component takes units, not rows, in the same way a project does. Booking three of ten
leaves seven on the shelf and puts a new three-unit row into the build. Un-booking a component
returns it to loose stock.

Finishing a WIP build gives it a **new code** with the `PRD` prefix, so a finished product is
identifiable as one at a glance and its old WIP label is not silently still valid.

## From a project to the shelf

A finished project can be registered as a sellable finished good, but only if its project type
declares that its builds may become shop stock. Customer work is built for one customer and gets
invoiced, so it never becomes stock. Attempting it on a customer-work type gives you a message
saying exactly that.

The new finished good starts with the project's material cost as its cost and the project's list
price as its sale price. That cost is an estimate until you book the real components onto it in the
finished-good editor, at which point the estimate is replaced by their sum.

## Deleting a set

Deleting a set does not delete its parts. They lose the link and stay in the warehouse as loose
stock. That is true for both kinds, so dissolving a lot returns its members to the shelf and
dissolving an assembly returns its components.

## On a project

A set assigned to a project takes its members with it, and its expense follows if the expense has
no project yet. On the project it counts as a single item at the set's own price, and its members
are not listed or billed separately. Releasing it sends the whole thing back, members included.
