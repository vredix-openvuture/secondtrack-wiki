---
title: The hub
description: "The finance page: KPIs from InvoiceNinja, the invoice list with its statuses and filters, the order section, and the buttons that run a job now."
sidebar:
  order: 2
---

The hub is where the outside systems meet. It shows what InvoiceNinja and WooCommerce currently
say, and it holds the buttons that act on them. Nothing on it is stored locally except the links
between the two.

## The KPIs

Three figures, derived from the invoice list rather than from a separate report:

| Figure | What it counts |
|---|---|
| **Paid** | `amount − balance` over every non-draft invoice |
| **Outstanding** | The balance over the same |
| **Drafts** | The amount of every draft |

Alongside them, a count of real invoices and a separate count of drafts. Drafts are counted
separately because they are usually leftover test documents and would otherwise inflate the number
that matters.

## The filters

| Filter | Parameter | Default |
|---|---|---|
| Period | `period=all|year|month` | all |
| Show drafts | `drafts=1` | off |
| Include archived | `archived=1` | on |

Archived invoices are included by default, because a completed and paid invoice is often archived
in InvoiceNinja and excluding it would make the paid figure wrong.

Three kinds of invoice are never shown: deleted ones, and invoices belonging to a deleted client.
InvoiceNinja hides those in its own interface while still returning them from the API, so the hub
hides them too and matches what you see there.

## The invoice list

Up to 80 invoices, newest first, each with its number, client, amount, balance, date, due date and
status.

| Status id | Label |
|---|---|
| 1 | Entwurf |
| 2 | Versendet |
| 3 | Teilzahlung |
| 4 | Bezahlt |
| 5 | Storniert |

A row is marked overdue when it still has a balance and its due date has passed. A row is marked as
synced once its PDF has been uploaded to Nextcloud. Each row links into InvoiceNinja itself.

Per row you can send the invoice, a reminder or a dunning notice, and archive the PDF to Nextcloud
by hand.

:::note
The five status labels are German regardless of the language setting.
:::

## Orders

The order section lists recent WooCommerce orders in the configured statuses, with the customer,
the total, the date, and the invoice and fulfillment task if they exist. An order without an
invoice has a button that creates one.

The whole flow, including what happens without you pressing anything, is on
[Shop orders](/shop/orders/).

## Doing a job now

Three buttons run what the [background jobs](/reference/jobs/) do on their own schedule:

| Button | Runs | Reports |
|---|---|---|
| **Check orders** | The order poll | How many new receipts went out |
| **Process overdue** | The reminder and dunning pass | How many of each were sent |
| **Archive paid** | The Nextcloud sync | How many were newly filed and how many updated |

They are useful for testing a connection you have just configured, and for the moment you notice
something should have happened and do not want to wait for the interval.

## When something is off

Each half of the page reports its own state. WooCommerce off means no order section; InvoiceNinja
off means no KPIs and no invoices. An error from either is shown as text where its section would
be, rather than as an empty list that looks like a quiet business day.
