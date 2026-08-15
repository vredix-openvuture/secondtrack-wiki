---
title: FAQ
description: What the application deliberately does not do, what is honestly unfinished, and the questions that come up before you commit to it.
sidebar:
  order: 2
---

## Can more than one person use it?

No. One account, one set of settings, no roles. Two people sharing a login works in the sense that
nothing stops it, and there is no audit trail to tell them apart afterwards.

## Do I have to connect anything?

No. With no connection at all you get the warehouse, projects, expenses, labels, the Markdown
export and the statistics. What you lose is invoices, receipts, shop orders, tasks, archiving and
price suggestions, because those belong to the systems that own them. See
[One home per fact](/concepts/one-home/).

## Why does it not write its own invoices?

Because invoice numbering, PDF layout, tax handling and e-invoicing are a large problem with legal
consequences, and InvoiceNinja already solves it. Duplicating it would mean two sets of numbers and
two answers to what was invoiced.

## Can I use a different invoicing system?

Not without writing code. Every InvoiceNinja call is in one module, which makes it the right shape
for a second implementation, but nothing above it is abstracted over a choice of backend.

## What happens if I delete a project?

Its items return to the warehouse, its sets are released with their members, and its expenses keep
their receipts and fall back to the warehouse bucket. The gallery photos are deleted, files
included. Anything already created in InvoiceNinja or Vikunja stays there.

## Can I undo a migration?

No. Restore the database copy you took before updating. That is the only way back, which is why
[Updating and removing](/start/update-remove/) puts the backup step first.

## How do I back it up?

Stop the application and copy the data directory. It holds the database, the uploads and the
exports, and nothing else exists anywhere.

## Is there an API?

No public one. Every route serves the interface. A handful return JSON because a dialog needs it,
listed in [Routes](/reference/routes/), but they are not a stable contract and they need a session.

## Are there tests?

No. Changes are verified by running the application.

## What is honestly unfinished

Each of these is described where it applies, and collected here so the list is in one place.

| Thing | State |
|---|---|
| **Listing a build in the shop** | The WooCommerce product upsert is written but nothing calls it. Listing is done by hand |
| **Linking an order to the build that filled it** | Only fires for projects carrying the legacy `kind` field, which no project created today does |
| **The device model** | Migrated away, but the table, the class and the legacy statuses are still in the code for databases that have not run the migration |
| **Language** | Roughly 600 strings are translated, but some warehouse and project messages, the hub's status labels, the fulfillment task text and the whole Markdown export are hard-coded German |
| **Multi-user** | One account |
| **Statistics** | Every figure is computed, but there is no history, so no month can be compared with the one before |
| **Accessibility** | See [Accessibility](/help/accessibility/) |
| **Tests** | None |

## Why is the Markdown export in German?

It predates the translation layer and was never moved onto it. The front matter keys, the headings
and the column labels are all German regardless of the language setting.

## Why does an expense need a receipt?

Because an item with no cost makes every figure downstream a guess, and the moment the rule has an
easy exception it stops being enforced at all. The two ways around it are explicit: tick free, or
point at an expense that already carries one.

## Why is a set billed as one line?

Otherwise the same purchase is charged twice, once as the lot and once as the parts in it. The item
list, the calculation, the export and the invoice all use the same list for the same reason: they
cannot disagree if there is only one of them.

## Can I run it without Docker?

Yes. It is a normal Python application. See [Installation](/start/install/). Label printing then
needs `cups-client` on the host.
