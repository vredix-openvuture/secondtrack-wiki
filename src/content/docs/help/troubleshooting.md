---
title: Troubleshooting
description: The failure modes that actually happen, what causes each one, and the check that confirms it.
sidebar:
  order: 1
---

## Getting in

### The password from `.env` does not work

Those two variables are read once, when the users table is empty. If an account already exists they
are ignored, and changing them does nothing.

```sh
docker compose exec secondtrack \
  python -c "import sqlite3;print(sqlite3.connect('/data/secondtrack.db').execute('select id,username from users').fetchall())"
```

There is no password reset. Either update the hash directly, or delete the user row and restart so
the seed runs again with the values currently in `.env`.

### Logged out on every page

The session cookie is not coming back. Two usual causes:

- `SECONDTRACK_COOKIE_SECURE=1` while you are on plain HTTP. The cookie is then only sent over
  HTTPS, so it never returns.
- `SECONDTRACK_SECRET_KEY` changed. Every existing session is invalidated, which is correct but
  looks like a bug.

### The two-factor code is rejected

Codes from one step either side are accepted, so the clock on the phone or the server is off by
more than about a minute. Check the server's clock first, it is the one nobody looks at.

## Warehouse

### It refuses to save without a receipt

Working as intended. Either attach a PDF or an image, tick free, or point the item at an expense
that already carries a receipt.

### The receipt stayed in the warehouse after booking

Also intended, in three cases: you booked part of the quantity, the receipt covers other parts or a
whole set, or you handed the item over free. The message after the booking says so.
[The item that travels](/concepts/items/) has the full table.

### A part vanished from the list

Check where it went:

| It is | It appears in |
|---|---|
| On a project | Not in the warehouse at all |
| In an assembly | Not in the parts list, it is consumed |
| Marked as merch | The merch department |
| In a lot | The parts list, since a lot's members stay available |

A filter is the other candidate: category, supplier, location or low stock, all in the query
string.

### Low stock never triggers

The reorder level is one of the global optional fields, stored per part. An empty value means no
alert, which is different from zero. It is also read from the `extra` JSON first and only then from
the legacy column, so a part edited since the migration keeps its value in the new place.

## Labels and scanning

### The QR code points at the wrong host

Set the public base URL in Settings, General. Without it the QR encodes the address the request
came in on, which behind a reverse proxy is the internal one.

### The printed label is blank or tiny

That is the browser print pipeline, which is why the print button does not use it. Use the print
button, which submits the job from the server with the media size set. If you have to print by
hand, use the PDF: a PNG carries its size only as metadata and most viewers assume 96 dpi.

### The print button says no printer is configured

Set the queue name in Settings, General. Empty means the button does nothing but say so.

### `lp` is missing

Only in a bare checkout. Install `cups-client`. The container has it.

### The camera does not appear on the scan page

The browser's barcode detector needs a secure context. Over plain HTTP the camera is unavailable
and only the manual field works, which is also what a handheld scanner types into.

## Money

### Profit looks wrong

Work through it in this order:

1. Does the project have items? A project with none falls back to its legacy purchase price.
2. Are the quantities right? Prices are per unit and quantity is multiplied in.
3. Is anything a giveaway? Those are billed at zero and their cost is advertising, not material.
4. Is there a list price set? It overrides the suggestion everywhere.
5. Which hourly rate applied? Session, then project, then global.

[How the money is worked out](/concepts/money/) has every formula.

### The suggested price seems too low

It is item value plus labour. Purchase cost is deliberately not added on top, because it is already
reflected in the items' sale prices.

### An expense is missing from InvoiceNinja

Either it was created while the connection was off, in which case editing it pushes it, or it was
deleted on the InvoiceNinja side, in which case the local row still holds an id and the normal push
skips it. The resync button on the expenses page fixes the second case.

### Statistics show income of zero

Income comes from paid InvoiceNinja invoices. Without that connection there is no income side at
all, and the box shows a loss equal to your expenses.

## Shop and tasks

### Orders are not arriving

| Check | |
|---|---|
| Is the connection on, and are the credentials right? | The hub says so |
| Is the order's status in your list? | Default is `processing,completed,on-hold` |
| Webhook or polling actually enabled? | Both are off by default |
| Is secondtrack reachable from the shop? | For the webhook |

### Historical orders were never processed

Expected. Polling records a watermark when it is first enabled and never works backwards. Invoice
an old order by hand from the hub.

### The webhook returns 200 but nothing happens

It returns 200 for bad JSON, a payload with no order id and a status outside your list, so
WooCommerce does not retry a payload that will never be valid. The response body says which case it
was.

### No fulfillment task

Vikunja off, or the fulfillment task switch off, or the board name wrong. Task creation never
breaks the receipt path, so everything else having worked is not evidence that Vikunja is fine.

### The Kanban board is one column called Tasks

The last of three fallbacks, meaning that Vikunja did not return buckets the way the page expects.
Not a failure, just a flat list.

## General

### Every page is slow, not just one

A page that talks to another system waits for it, and pages differ in how much they ask for:

| Page | Asks |
|---|---|
| A project | The invoice, and the client list |
| The project list | The client list |
| The hub | The invoice list, the KPIs, the orders |
| The dashboard | Only what its enabled tiles need |
| Tasks | The Vikunja projects and their tasks |
| Warehouse, expenses, statistics, settings | Nothing |

So the first thing to establish is whether the slow page is one that waits on something. If the
warehouse and `/healthz` are instant while the hub takes ten seconds, the application is fine and
the system it is asking is slow.

If **everything** is slow, including `/healthz`, suspect the machine or the database file rather
than an integration. Switching a connection off in the settings is the quickest way to prove which
one is responsible: a disabled integration is never called.

:::note
Handlers that call another system run in a threadpool, so one slow request no longer holds up the
others. Before that fix a single slow InvoiceNinja call froze every page for its duration, which
looked exactly like the whole application being slow.
:::

### The interface still looks old after an update

Static assets are versioned by their modification time, so they cannot be stale after a rebuild.
Reload the page once. If it persists, the browser is holding the HTML, not the assets.

### A setting saved in the interface does not apply

Check that you are running a single worker. Each worker keeps its own settings cache, and a save in
one is invisible to the others until they restart.

### An `.env` change had no effect

Expected for anything with a `cfg_` key. The environment only seeds those, and once saved in the
interface the database wins. See [How settings are stored](/concepts/settings-model/).
