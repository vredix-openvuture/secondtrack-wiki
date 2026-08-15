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

## The four statuses

| Status | Means |
|---|---|
| **Open** | Created, nothing done yet |
| **In progress** | Being worked on |
| **Done** | Finished, not yet invoiced |
| **Invoiced** | An invoice exists in InvoiceNinja |

Moving into done or invoiced stamps the archive date. Moving back out clears it again, so an active
project does not keep claiming it was closed on some past day.

The project list filters on active (open and in progress), done and invoiced. Statistics counts
"expected" figures over everything that is not yet invoiced.

:::note
Three older values, in production, archived and sold, still exist in the enum for databases that
have not been through the [status migration](/start/update-remove/). They are never offered as a
choice. One code path still writes `sold`, described in [Shop orders](/shop/orders/).
:::

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
