---
title: Nextcloud
description: The app password, the folder layout for invoices and receipts, how the sync detects changes and deletions, and why it only ever writes.
sidebar:
  order: 4
---

Nextcloud is the document archive. secondtrack writes the PDFs and receipts it produced into it,
under one base folder, and never reads anything else in your account.

## Setting it up

1. In Nextcloud: **Settings, Security, Devices and sessions**, create an app password. Do not use
   your login password, especially if you have two-factor on, where it will not work at all.
2. In secondtrack: **Settings, Connections, Nextcloud**.

| Field | Default |
|---|---|
| **Enabled** | off |
| **URL** | |
| **User** | |
| **App password** | Kept when submitted blank |
| **Base path** | `/OpenVuture` |
| **Auto-archive** | off |

There is a **test button**. It sends a `PROPFIND` to the WebDAV root and reports whether the URL
and credentials work, which is worth doing before the first write.

Everything goes to `/remote.php/dav/files/<user>`, with a 30 second timeout and 60 for an upload.
Each path segment is URL-encoded individually, so spaces and umlauts in a customer name are fine.

## Where things land

| What | Path |
|---|---|
| Invoice | `<base>/Invoices/<year>/<month>/<number>_<customer>.pdf` |
| Receipt | `<base>/Expenses/<year>/<MM - Month>/<ISO date>_<name>.<ext>` |
| A deleted invoice's PDF | `<base>/Invoices/<year>/<month>/deleted/<the same filename>` |

Missing folders are created, parent by parent. Illegal filename characters are replaced with
hyphens and whitespace is collapsed.

The invoice year and month come from the invoice date. Expenses use their own date, and spell the
month out, `08 - August`, because that folder is browsed by a human far more often.

## The sync

Runs every 15 minutes when auto-archive is on, and on demand from the hub.

It walks up to 400 invoices, including archived and deleted ones, and for each:

| Case | Action |
|---|---|
| Deleted in InvoiceNinja | Its PDF is moved into the `deleted/` subfolder of its month |
| Not paid | Skipped. Only paid invoices are archived |
| Paid, never synced | Downloaded and uploaded |
| Paid, changed since | Downloaded and uploaded again, overwriting |
| Paid, unchanged | Skipped |

Change detection uses the invoice's `updated_at`, falling back to its amount. The index of what has
been uploaded, with each file's path, is kept in the settings table, which is what lets the hub
show a per-row sync mark.

A move that fails because the source is gone is not an error, it means someone tidied up by hand.

## Auto-archive after sending

With auto-archive on, an invoice is filed immediately after it is emailed, in addition to the
15 minute sweep. That path is wrapped: an archiving failure never breaks a send.

## What it never does

- It never reads your files. Only `PROPFIND` on the root, for the test button.
- It never deletes. A removed invoice's PDF is moved into `deleted/`, not destroyed.
- It never writes outside the base path.

## Related

- [Expenses](/money/expenses/)
- [The hub](/money/hub/)
- [Background jobs](/reference/jobs/)
