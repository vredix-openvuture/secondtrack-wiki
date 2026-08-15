---
title: WooCommerce
description: Creating the API key pair, choosing which order statuses count, setting up the webhook or polling, and what the connection reads.
sidebar:
  order: 2
---

WooCommerce is the shop. secondtrack reads orders from it and turns paid ones into receipts, local
customers and fulfillment tasks. It never writes to the shop.

## Setting it up

1. In WordPress: **WooCommerce, Settings, Advanced, REST API**, create a key pair. Read access is
   enough for everything that is currently wired up.
2. In secondtrack: **Settings, Connections, WooCommerce**.

| Field | Default | Notes |
|---|---|---|
| **Enabled** | off | |
| **URL** | | The shop root, without `/wp-json` |
| **Consumer key** and **secret** | | Kept when submitted blank |
| **Order statuses** | `processing,completed,on-hold` | Comma separated. Only these are listed and processed |

The connection counts as on only when enabled, URL, key and secret are all set. Requests go to
`/wp-json/wc/v3` with basic authentication and a 20 second timeout.

## Order statuses

The status list does two jobs: it filters what the hub shows, and it decides what the automation
acts on. An order in a status outside the list is ignored by both.

The default includes `on-hold`, which is not necessarily paid. If your automation should only fire
for money actually received, narrow it to the statuses your shop uses for that.

## Getting orders in

Two routes, described in full on [Shop orders](/shop/orders/).

### Webhook

In WooCommerce, add a webhook for the order events you care about, with the delivery URL
`https://your-secondtrack/webhooks/woo` and a secret. Then in secondtrack, on the same settings tab:

| Field | Default |
|---|---|
| **Webhook enabled** | off |
| **Webhook secret** | empty |

The secret must match the one in WooCommerce. The body is verified as a base64 HMAC-SHA256 against
it.

:::caution
Enabling the webhook without setting a secret skips verification entirely. The route is the only
one in the application without a login, so anyone who can reach the URL can trigger processing.
:::

### Polling

| Field | Default |
|---|---|
| **Polling enabled** | off |
| **Interval** | 5 minutes, minimum 1 |

Switching it on records a watermark, and only orders created at or after that moment are ever
processed. Enabling polling on an established shop therefore does not work through your history.

## Fulfillment tasks

On the same tab, because they are part of the order flow rather than of Vikunja's own settings:

| Field | Default |
|---|---|
| **Create fulfillment task** | on |
| **Vikunja board** | `customers` |

The board is created under the configured Vikunja parent project if it does not exist. Needs the
[Vikunja connection](/integrations/vikunja/); without it, nothing is created and nothing else
breaks.

## What it reads

| Call | Used for |
|---|---|
| `GET /orders` | The hub list, and the poll |
| `GET /orders/{id}` | One order, for the invoice, the customer and the task |

An order is mapped onto invoice line items by taking each line's total divided by its quantity as
the unit price, plus a shipping line if the order has shipping. The order number becomes the PO
number.

## Product upsert

The code to create or update a WooCommerce product from a finished project exists. It builds a
draft product with the project's name, its list price, the Markdown export as the description, and
stock management on with a quantity of one.

:::note
Nothing in the interface calls it. Listing a build in the shop is still done by hand in WooCommerce.
It is on the roadmap.
:::

## Related

- [Shop orders](/shop/orders/)
- [The hub](/money/hub/)
