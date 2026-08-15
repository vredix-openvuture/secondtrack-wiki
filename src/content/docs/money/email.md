---
title: Email, reminders and dunning
description: The two sending providers, the four templates and their placeholders, SMTP settings, and how overdue invoices are chased automatically.
sidebar:
  order: 3
---

## Two providers

Mail leaves one of two ways, chosen in **Settings, Connections, Email**.

| Provider | Who sends | Templates used |
|---|---|---|
| **secondtrack** | Your own SMTP server | The four templates below, with the PDF attached |
| **InvoiceNinja** | InvoiceNinja's own mail configuration | InvoiceNinja's templates |

With InvoiceNinja as the provider, the local templates are not used at all, and the kind of mail is
mapped onto an InvoiceNinja template:

| Here | There |
|---|---|
| Invoice | `invoice` |
| Reminder | `reminder1` |
| Dunning | `reminder3` |
| Receipt | `invoice`, with the payment receipt sent alongside the recorded payment |

Sending is considered available when the chosen provider is ready: SMTP configured, or InvoiceNinja
connected. The email tab shows which state it is in.

## SMTP

| Setting | Default | Notes |
|---|---|---|
| Enabled | off | Nothing is sent while this is off |
| Host | empty | |
| Port | 587 | |
| User | empty | Empty means no login is attempted |
| Password | empty | Kept when submitted blank |
| Security | `tls` | `tls` starts TLS after connecting, `ssl` connects with TLS, `none` neither |
| From name | `secondtrack` | Also used as `{company}` in templates |
| From address | empty | Required |

There is a test button: it sends a short message to an address you type and reports the SMTP error
verbatim if it fails, which is usually enough to tell an authentication problem from a firewall.

## The four templates

Each has a subject and a body, both plain text.

| Template | Sent when |
|---|---|
| **Invoice** | An invoice goes out, with the PDF attached |
| **Reminder** | An invoice is past due |
| **Dunning** | It is well past due |
| **Receipt** | A shop order was paid, with the PDF attached |

Placeholders are filled in both subject and body. An unknown placeholder becomes empty rather than
breaking the send.

| Placeholder | Value |
|---|---|
| `{client}` | The client's display name, or their email if it has no name |
| `{number}` | The invoice number |
| `{amount}` | The amount with the currency symbol |
| `{due_date}` | The due date as InvoiceNinja stores it |
| `{link}` | The public invoice link, if the invoice has one |
| `{company}` | The from name |

The receipt template is not editable in the interface. It has a default and is only replaced by
editing the setting directly.

## Chasing overdue invoices

Two intervals, both in days after the due date:

| Setting | Default |
|---|---|
| Reminder after | 0 days |
| Dunning after | 30 days |

A reminder at zero days means it goes out on the first pass after the due date has passed.

The pass walks every invoice secondtrack has a link row for, and skips anything deleted, anything
with no balance and anything with no due date. Then, per invoice:

- Past the dunning threshold and no dunning sent yet: send the dunning notice.
- Otherwise past the reminder threshold and no reminder sent yet: send the reminder.

Each stage is sent **at most once per invoice**, ever, because the send time is recorded on the
link row. There is no escalating sequence beyond those two steps.

Automatic sending is off by default. With it on, the pass runs once a day; the hub has a button to
run it now. See [Background jobs](/reference/jobs/).

:::caution
Only invoices with a link row are chased, which means invoices secondtrack created from an order or
a project. An invoice created directly in InvoiceNinja is not, because secondtrack does not know
about it. Those can still be mailed by hand from the hub.
:::
