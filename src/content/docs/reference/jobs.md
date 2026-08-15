---
title: Background jobs
description: The three periodic tasks, their intervals, what switches each one on, and how to run them by hand.
sidebar:
  order: 6
---

Three loops start with the application and run inside the same process. There is no worker, no
scheduler and no queue.

| Job | Interval | Runs when | Button |
|---|---|---|---|
| **Due mail** | 24 hours | `email_auto` is on | Hub, process overdue |
| **Order check** | `woo_poll_interval`, 5 minutes by default | `woo_poll_enabled` is on | Hub, check orders |
| **Nextcloud sync** | 15 minutes | `nc_auto_archive` is on and Nextcloud is connected | Hub, archive paid |

Each one sleeps first, so nothing fires at startup. The switch is checked when the timer expires,
not when the loop starts, so turning a job on takes effect without a restart. The order check also
re-reads its interval every round.

Every loop swallows its exceptions and continues. A failing job is silent by design: it must not
take the web server down with it. The way to see whether one is working is the corresponding button
in the hub, which does the same work in the foreground and reports what happened.

## Due mail

Walks every invoice with a link row and sends at most one reminder and at most one dunning notice
per invoice, ever. Detail on [Email, reminders and dunning](/money/email/).

## Order check

Asks WooCommerce for the 50 most recent orders and processes the ones it has not seen, in the
configured statuses, created at or after the watermark. Detail on [Shop orders](/shop/orders/).

## Nextcloud sync

Walks up to 400 invoices including archived and deleted ones, uploads the paid ones that are new or
changed, and relocates the PDF of a deleted one. Detail on
[Nextcloud](/integrations/nextcloud/).

## Running with more than one worker

The application assumes a single uvicorn worker. With several:

- Each worker runs its own copy of all three loops, so the work happens as many times as you have
  workers. The idempotency guards prevent duplicate invoices and tasks, but the requests are still
  made.
- Each worker has its own settings cache, so a setting saved in one is not seen by the others until
  they restart.

The shipped container runs one worker.

## Watching them

There is no job log. What is observable:

| Signal | Where |
|---|---|
| A new invoice appeared | The hub |
| A receipt went out | The `emailed_at` timestamp on the link row |
| A file was archived | The sync mark on the hub row |
| Anything at all | Container logs, though the loops themselves stay quiet on failure |
