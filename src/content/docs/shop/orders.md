---
title: Shop orders
description: What happens automatically when a paid WooCommerce order arrives, the webhook and polling routes, and why nothing is ever created twice.
sidebar:
  order: 1
---

A paid order arrives and four things happen without anyone typing.

| # | Step | Result |
|---|---|---|
| 1 | **Document** | A document is created in InvoiceNinja, marked paid so it counts as income, and emailed as a receipt |
| 2 | **Customer** | The buyer is stored as a local customer and linked to the InvoiceNinja client |
| 3 | **Task** | A fulfillment task appears in Vikunja with everything needed to ship it |
| 4 | **Own goods** | If the ordered product was one of your own shop builds, that project is marked sold |

Steps 3 and 4 have caveats, described below.

## Two ways in

Only one is needed.

| | Webhook | Polling |
|---|---|---|
| **How** | WooCommerce posts every order to secondtrack as it happens | secondtrack asks for recent orders on an interval |
| **Speed** | Seconds | The interval, 5 minutes by default |
| **Setup** | A webhook in the WooCommerce admin, plus the shared secret here | One checkbox here |
| **Needs** | secondtrack reachable from the shop | Nothing beyond the API credentials |

### The webhook

`POST /webhooks/woo`, the only route in the application that does not require a login. It is
verified instead: if a secret is configured, the `x-wc-webhook-signature` header must be the
base64 HMAC-SHA256 of the raw body under that secret, and a mismatch is rejected with 401.

:::caution
With the webhook enabled and **no** secret set, the signature check is skipped entirely and anyone
who can reach the URL can trigger order processing. Set the secret.
:::

Everything else about it returns 200, including bad JSON, a payload with no order id and an order
in a status you are not tracking. That is deliberate: a non-200 makes WooCommerce retry, and a
retry storm over a payload that will never be valid helps nobody. The body says what happened.

### Polling

The order check asks for the 50 most recent orders and processes the ones it has not seen, in your
configured statuses.

**The watermark** is the important part. When polling is switched on for the first time, the
current time is recorded, and only orders created at or after it are ever processed. Without it,
enabling polling on an established shop would send receipts for your entire order history. If the
watermark is somehow missing when the job runs, the job sets it and processes nothing that round.

## The fulfillment task

Created in the Vikunja board named in the WooCommerce settings, `customers` by default, and the
board is created if it does not exist.

Title: `📦 Bestellung #812 – Max Mustermann`. The description holds the packing list with
quantities and SKUs, the shipping address (falling back to the billing address if no shipping one
was given), the email and phone, the order total, the customer's note if there is one, the invoice
number, and a link straight to the order in the WooCommerce admin.

Creation is best effort and never breaks the receipt path. If Vikunja is unreachable, the document
is still created and emailed, and the order simply has no task.

:::note
The task text is German.
:::

## Never twice

Every step is idempotent, and the link row is what makes it so.

| Guard | Effect |
|---|---|
| The order id is unique on the link table | One order, one invoice, always |
| The task id is stored on the link row | The task is created once |
| The customer is deduplicated by InvoiceNinja client id, then by email | One customer |
| The send time is stored on the link row | The receipt goes out once |

Webhook and polling running at the same time is therefore harmless, just wasteful.

## Marking the build sold

The step that links an order back to the build that filled it looks for a project whose WooCommerce
product id matches something in the order, and sets it to sold.

:::caution
It also requires the project's legacy `kind` field to be `shop`, and no project created since the
projects rework carries that value: today's equivalent is the shop-stock flag on the project type.
In practice this step only ever fires for projects from before the rework. It is on the roadmap.

Marking it sold also writes the legacy `sold` status, which is not one of the four statuses the
interface offers.
:::

## What to check when nothing happens

| Symptom | Look at |
|---|---|
| No order in the hub | The WooCommerce connection, and whether the order's status is in your list |
| No document, no email | The InvoiceNinja connection |
| No task | Vikunja off, or the fulfillment task switch off |
| Task in the wrong board | The board name in the WooCommerce settings |
| Old orders were never processed | Expected. The watermark excludes everything before polling was enabled |
