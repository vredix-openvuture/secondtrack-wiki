---
title: What a project is
description: The project container, its number, the four statuses, project types and the shop-stock flag, and how customers are attached.
sidebar:
  order: 1
---

A project is a container: a job with a customer, a number, items taken from the warehouse, hours
logged against it and a price at the end. It is not a device. It creates nothing itself.

## The number

Every project gets one on creation, in the form `PJ-20260815-K4QW`: the prefix, the UTC date, and
four characters from uppercase letters and digits. It is generated on the server, checked for
collisions, and unique across the database.

It is the number a customer sees. When a project is invoiced, it travels as the InvoiceNinja PO
number, so nothing internal appears on the document.

## The lifecycle

The first four steps are yours to set. The last three are consequences of what happened to the
invoice, so they are reached by doing that thing rather than by picking from a dropdown.

| Status | Means | Set by |
|---|---|---|
| **Open** | Created, nothing done yet | You |
| **In progress** | Being worked on | You |
| **Done** | Finished, not yet invoiced | You |
| **Invoiced** | An invoice exists in InvoiceNinja | Raising the invoice |
| **Payment pending** | The invoice is with the customer | Sending it |
| **Paid** | The payment is recorded, in InvoiceNinja too | The **Mark as paid** button |
| **Archived** | Filed away, off the working list | The **Move to archive** button |

The order is enforced: an invoice that was never sent cannot be marked paid, and a project that was
never paid cannot be archived. Both refuse with a reason rather than silently doing nothing.

Moving into done, invoiced or archived stamps the archive date. Moving back out clears it again, so
an active project does not keep claiming it was closed on some past day.

## Locked once the invoice is out

A project locks the moment its invoice has been **sent**, not when its status happens to say so.
Sending is what puts the document in someone else's hands, and that is the thing that makes the
items and hours a record rather than a workspace: changing them afterwards would make the two
disagree with nothing to show for it.

The distinction matters for projects invoiced before this lifecycle existed. Their status stopped at
invoiced while the invoice had long gone out, and reading the status alone would have left them
editable. A startup migration moves them to payment pending as well, so the badge agrees with the
behaviour.

What is gone: editing the project, assigning or releasing items, changing a booked quantity, work
sessions, notes, photos, expense assignment, stocking it as a finished good, deleting the project,
and every invoice action except looking at it. The warehouse refuses to book anything onto it too.

What remains: **Check invoice**, which still shows the PDF and offers the download, and whichever
single lifecycle step is next.

This holds in the routes, not only in the page. The forms are hidden, and a request sent to those
URLs anyway is answered with the same refusal.

:::note
Three older values, in production, archived and sold, still exist in the enum for databases that
have not been through the [status migration](/start/update-remove/). They are never offered as a
choice, and nothing writes them any more except the one path described in
[Shop orders](/shop/orders/). The new archived status is stored as `closed` precisely so the
migration, which rewrites the old `archived`, can never touch it.
:::

## The list

**All** is where you land, and it is not one long list: it shows everything still on the desk, split
into a section per status, in the order a project travels. A section carries the same badge its rows
would, so a block is recognised by colour before it is read, and the per-row status column is left
out there because under an "Open" heading it would only repeat the heading.

The archive is its own tab and is excluded from every other one. A place you file things away to
should not clutter the list you work from.

The remaining tabs are single filters: active (open and in progress), done, and invoiced, where
invoiced covers everything with an invoice out, so payment pending and paid appear there too. Those
stay flat, with the status column, since a filter is already one heading.

Statistics counts "expected" figures only over projects with no invoice yet. Once one is out the
money is no longer a forecast, it is owed or received, and both belong in the
[profit and loss box](/money/statistics/) instead.

## Project types

A type is a row you can extend, not a fixed list. Two are seeded: **Customer order** and **Shop
production**. Add your own, "Repair" or "Conversion", from the same dropdown that selects one, with
no separate settings page.

A type declares exactly one thing: whether its builds may be stocked as sellable finished goods.

| Shop stock | Means |
|---|---|
| Off | The build is for one customer and gets invoiced. It can never become shop stock |
| On | In-house production. The finished project can be registered as a finished good |

That flag is the only behaviour a type carries, and it is why a type has to declare something at
all: without it a custom type would have no defined meaning.

## Customers

A customer is a thin local record: a name, a kind, an email, a company, and optionally the id of an
InvoiceNinja client.

| Kind | Means |
|---|---|
| **Internal** | No external invoicing. A label |
| **InvoiceNinja** | Backed by a client in InvoiceNinja, so an invoice can be raised against it |

The picker on a project offers three routes: an existing local customer, an existing InvoiceNinja
client fetched live, or a new one typed on the spot. Creating a new customer of the InvoiceNinja
kind also creates the client there, if the connection is on. Picking an existing InvoiceNinja
client creates the local row that points at it.

Leaving the dropdown untouched keeps the current customer. Choosing the empty entry clears it.

## What lives on a project

| Part | Page |
|---|---|
| Items taken from the warehouse | [Items on a project](/projects/items/) |
| Work sessions | [Time and price](/projects/time-and-price/) |
| The price and profit calculation | [Time and price](/projects/time-and-price/) |
| Markdown reports and reference photos | [Notes, photos and export](/projects/notes-photos/) |
| Expenses booked onto it | [Expenses](/money/expenses/) |
| The invoice | [Invoicing a project](/projects/invoicing/) |

## Deleting one

Deleting a project releases rather than destroys. Its items return to the warehouse, its sets are
released with their members, its expenses keep their receipts and fall back to the warehouse
bucket. The reference photos are the exception: the rows and their files are deleted with the
project, because an image row without its file is worth nothing.
