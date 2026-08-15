---
title: First run
description: The order to do things in during the first hour, from the first login to the first project that produces a real profit figure.
sidebar:
  order: 3
---

The app is usable the moment you log in, but the order below is the one that avoids rework. Each
step is optional except the first.

## 1. Log in and secure the account

Log in with `SECONDTRACK_ADMIN_USER` and `SECONDTRACK_ADMIN_PASSWORD` from `.env`. Those values are
only read when the users table is empty, so changing them in the file later does nothing.

Go to **Settings, Account** and change the password. Six characters is the enforced minimum, which
is a floor, not a recommendation. Turn on two-factor while you are there: the QR code is shown
once, and the code you type back proves the app was actually added before it is enabled. See
[Account, keys and the app](/ui/app/).

## 2. Set the general values

**Settings, General** holds the values every calculation reads:

| Field | Why it matters now |
|---|---|
| **Hourly rate** | Every work session without its own rate uses it. Changing it later re-prices every past session that did not override it. |
| **Currency** | A display symbol only. No conversion happens anywhere. |
| **Language** | English or German. |
| **Public base URL** | What the QR codes encode. Set it before printing a single label. |
| **Label printer** | Host, queue and media, if you print from the server. |

## 3. Decide how much of the outside world you want

**Settings, Connections** has one tab per system. Nothing is required. If you connect nothing, the
warehouse, projects, expenses and statistics all work, and the hub and tasks pages say so plainly
instead of failing.

The order that causes least confusion:

1. **[InvoiceNinja](/integrations/invoiceninja/)** first, because expenses start mirroring to it
   the moment it is on, and invoices depend on it entirely.
2. **[Nextcloud](/integrations/nextcloud/)** next, if you want the receipts filed. It has a test
   button that verifies the URL and the app password before anything is written.
3. **[Vikunja](/integrations/vikunja/)**, if you want tasks and fulfillment tasks.
4. **[WooCommerce](/integrations/woocommerce/)** last, because it is the one that starts acting on
   its own. Read [Shop orders](/shop/orders/) before switching polling on.
5. **[eBay](/integrations/ebay/)** whenever, it only ever adds a suggestion next to a price field.

:::note
An expense created while InvoiceNinja is off stays local. Turning the connection on later does not
retroactively push it, but the resync button on the expenses page does. See
[Expenses](/money/expenses/).
:::

## 4. Build the warehouse skeleton

Do this before stocking anything, because these are the fields you will wish existed on the first
item.

1. **Categories**, in Settings, Categories. A category gives its parts extra fields of your choice
   and supplies the first three characters of their scan codes, so a CPU gets `CPU-3K7Q` instead of
   `PRT-3K7Q`. See [Categories and fields](/warehouse/categories/).
2. **Storage locations**, in Warehouse, Locations. Build the tree the way the room actually is:
   room, rack, shelf, bin. Each one gets its own code and its own printable label.
3. **Suppliers**, in Warehouse, Suppliers, if you buy from the same places repeatedly.

## 5. Stock the first item

Warehouse, New. The one thing the form insists on is a receipt, as a PDF or a photo, unless you
tick free or point the item at an expense that is already booked. That is deliberate: an item with
no receipt has no cost, and an item with no cost makes every profit figure downstream a guess.

Print its label from the label page and stick it on. Scanning it with a phone opens that item.

## 6. Run one project all the way through

1. **Projects, New.** Give it a name, a type and a customer. It gets a number of the form
   `PJ-20260815-K4QW` automatically.
2. **Assign the item** you just stocked. Its cost and its resale value follow it onto the project.
3. **Log a work session.** Date, hours, description, and a rate if this one is different.
4. **Read the summary.** Material cost, advertising cost, labour value, suggested price, profit
   before and after labour. If a number surprises you,
   [How the money is worked out](/concepts/money/) has the formula behind each one.
5. **Set a status.** Open, in progress, done or invoiced.

At that point everything else in the app is a variation on what you have already done.

## 7. Arrange the dashboard

Last, because it is the only step with no consequences. Ten tiles, dragged and resized on a grid,
saved as you arrange them. See [The dashboard](/ui/dashboard/).
