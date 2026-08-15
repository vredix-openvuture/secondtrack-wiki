---
title: One home per fact
description: Why secondtrack delegates invoicing, tasks, orders and files to other systems instead of storing its own copies, and what it does keep.
sidebar:
  order: 1
---

Every piece of information has exactly one home. Invoices live in InvoiceNinja, tasks in Vikunja,
orders in WooCommerce, archived documents in Nextcloud. secondtrack reads all of them and brings
them together, and never keeps a second copy that can disagree.

## Why

A second copy is not a backup, it is a future contradiction. The moment an invoice is edited in
InvoiceNinja and the local mirror is not, one of the two is wrong and nothing on the screen says
which. Rather than build reconciliation for problems it created itself, secondtrack asks the owning
system every time.

The cost is visible and accepted: when a connection is off or unreachable, the page says so instead
of showing a stale figure. That is the intended behaviour, not a failure.

## What is stored locally, and why

Only what has no other home, plus the links that stitch the systems together.

| Local data | Why it is local |
|---|---|
| Parts, sets, locations, suppliers, categories | No other system in the stack tracks physical stock at all |
| Projects, work sessions, reports, photos | The same |
| Expenses | Stored locally **and** mirrored, because the receipt has to survive InvoiceNinja being off |
| Customers | A thin local row that points at an InvoiceNinja client, so a project can name a customer without a round trip |
| `order_invoices` | The link table: which invoice belongs to which order or project |
| Settings | The app's own configuration |

## The link table

`order_invoices` is the one place where two worlds are tied together. One row records: this
WooCommerce order, or this project, produced that InvoiceNinja invoice, for this customer, with
that Vikunja fulfillment task, and here is when the invoice, the reminder and the dunning notice
went out.

It exists for exactly one reason: without it, a shop order processed twice creates a second
invoice. With it, the second attempt finds the row and returns it. The same guard covers the
project route, so a project can only ever have one invoice raised from it.

## What happens when a system is off

| Page | Behaviour |
|---|---|
| Dashboard | Tiles for a disabled system are skipped, the rest render |
| Hub | Says which side is off, and shows the other side |
| Tasks | Says Vikunja is disabled |
| Expenses | Fully usable, nothing is pushed |
| Projects | The invoice panel is hidden, everything else works |
| Warehouse | Unaffected, except the eBay suggestion button |

Errors from a connected system are caught and surfaced as text on the page. There is no state where
an unreachable service prevents you from stocking a part or logging an hour.

## Where the rule bends

Two places, both deliberate:

- **Expenses are stored twice.** The local row holds the receipt file and the allocation, the
  InvoiceNinja expense holds the bookkeeping. They can drift if InvoiceNinja is edited directly,
  which is why the expenses page has a resync button that treats InvoiceNinja as authoritative for
  existence and secondtrack as authoritative for content.
- **The invoice number and amount are cached** on the link row, so the hub can label a row without
  a request per invoice. The live values always come from InvoiceNinja when the page is built.
