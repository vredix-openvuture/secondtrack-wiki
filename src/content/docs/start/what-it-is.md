---
title: What secondtrack is
description: The scope of the project, what it does itself, what it leaves to other systems, and the words used throughout these docs.
sidebar:
  order: 1
---

secondtrack is a single-user web application for a refurbishing and repair business. It answers one
question well: what did this thing cost me, and what is left when I sell it. Everything else it
does exists to keep that answer true.

It is a FastAPI application with server-rendered Jinja templates and a SQLite database, running as
one container. There is no build step, no frontend framework and no background worker process. The
three periodic jobs run inside the same process as the web server.

## What it does itself

| Area | What it owns |
|---|---|
| **Warehouse** | Parts, purchase lots, finished goods and merch, with categories, suppliers, physical locations, scan codes and printable labels. |
| **Projects** | A container with a number, a customer, a type, items picked from the warehouse, work sessions and Markdown reports. |
| **Money** | Expenses with receipts, the price and profit calculation, and the statistics built on top of them. |
| **Presentation** | The dashboard, the style, the two languages, the login. |

## What it leaves alone

Five systems can be connected, all of them optional, all of them switched on individually. Each one
owns something secondtrack refuses to duplicate.

| System | Owns | Without it |
|---|---|---|
| [InvoiceNinja](/integrations/invoiceninja/) | Invoices and expenses: numbering, PDF, tax, payments | No invoices, no receipts, and expenses stay local only |
| [WooCommerce](/integrations/woocommerce/) | The shop and its orders | The hub shows no orders |
| [Vikunja](/integrations/vikunja/) | Tasks and boards | The Tasks page says it is off, and no fulfillment tasks are created |
| [Nextcloud](/integrations/nextcloud/) | The document archive | Nothing is filed away, receipts stay in the app |
| [eBay](/integrations/ebay/) | Market prices | No price suggestion next to the price field |

With none of them connected the app still runs: warehouse, projects, expenses, labels and
statistics all work offline from any other service. See [One home per fact](/concepts/one-home/)
for why the split is drawn where it is.

## Where the state lives

Everything is in one directory, mounted as `/data` in the container.

| Path | What it is |
|---|---|
| `/data/secondtrack.db` | The SQLite database, in WAL mode |
| `/data/uploads/` | Every uploaded image and receipt |
| `/data/exports/` | Markdown exports, unless you point them at a mounted vault |

Nothing is written outside it. Copying that directory copies the installation. See
[Files and paths](/reference/files/).

## The name of things

A few words are used precisely throughout these docs.

| Word | Means |
|---|---|
| **Part** | One row of stock. It may be a single unit or a quantity of identical units. |
| **Set** | A grouping of parts. Either a purchase lot or an assembly. |
| **Lot** | A set bought as one purchase: one receipt, one total, several products. |
| **Assembly** | A set built out of parts: a WIP build, or a finished good once it is done. |
| **Item** | Anything assigned to a project, part or set alike. |
| **Booking** | Moving units of stock onto a project. |
| **Giveaway** | An item handed over free, billed at nothing, counted as advertising. |
| **Bucket** | Where an expense is allocated: project, warehouse or advertising. |
| **Code** | The scan code an object carries, such as `CPU-3K7Q`. |

## What it is not

- **Not accounting software.** It computes what things cost and what they are worth. Bookkeeping,
  tax and compliance live in InvoiceNinja.
- **Not multi-user.** One account, one set of settings. See [Account, keys and the app](/ui/app/).
- **Not a shop.** Products are listed in WooCommerce; secondtrack reads the orders back.
- **Not finished.** Parts of it are honestly unfinished, and each page says so where it applies.
  The list is in the [FAQ](/help/faq/).
