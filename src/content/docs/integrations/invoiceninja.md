---
title: InvoiceNinja
description: Getting the API token, what secondtrack reads and writes, and every endpoint it touches.
sidebar:
  order: 1
---

InvoiceNinja is the invoicing engine. secondtrack never generates an invoice itself: numbering,
PDF rendering, tax and e-invoicing stay where they belong. It is also the mirror for every expense.

This is the connection with the widest reach. Without it there are no invoices, no receipts, no
KPIs, and expenses stay local.

## Setting it up

1. In InvoiceNinja: **Settings, Account Management, API Tokens**, create a token.
2. In secondtrack: **Settings, Connections, InvoiceNinja**.

| Field | Notes |
|---|---|
| **Enabled** | |
| **URL** | The public InvoiceNinja URL. Also used for the deep links from the hub |
| **Token** | Kept when submitted blank |
| **Auto-send** | Email an invoice the moment it is created |

The connection counts as on only when enabled, URL and token are all set.

## What it is used for

| Feature | Direction |
|---|---|
| Client list on projects and invoices | Read |
| Creating an invoice from a project or an order | Write |
| Deleting an invoice, from the review dialog on a project | Write |
| Recording a payment, so a shop order becomes a receipt | Write |
| Marking sent and marking paid | Write |
| Downloading the PDF, for mail attachments and the Nextcloud archive | Read |
| Hub KPIs and the invoice list | Read |
| Expenses, with the receipt attached as a document | Read and write |
| Vendors and expense categories | Read and write, created if missing |
| Sending mail, when it is the chosen provider | Write |

## The endpoints it touches

| Endpoint | Used for |
|---|---|
| `GET /invoices` | The hub list, the KPIs, the Nextcloud sync |
| `GET /invoices/{id}` | One invoice, with its client |
| `GET /invoices/{id}/download` | The PDF |
| `POST /invoices` | Creating one |
| `POST /invoices/bulk` | Mark sent, mark paid, email, delete |
| `POST /payments` | Recording a payment, optionally with the receipt mail |
| `POST /emails` | Sending with a named template |
| `GET`, `POST /clients` | Finding and creating clients |
| `GET`, `POST`, `PUT /expenses`, `POST /expenses/bulk` | The expense mirror |
| `GET`, `POST /vendors`, `/expense_categories` | Names on expenses |

All of it over `/api/v1` with an `X-Api-Token` header and a 20 second timeout, 30 for a document
upload.

## What it hides from you

The hub deliberately does not show three kinds of invoice, so that it matches what InvoiceNinja
shows rather than what its API returns:

- Deleted invoices.
- Invoices of a deleted client. InvoiceNinja hides these in its own interface while the API still
  returns them.
- Drafts, unless you ask for them, because they are usually leftovers.

The Nextcloud sync does ask for deleted ones, because it needs to know when to move an archived PDF
into the deleted folder.

## Client matching

Creating an invoice with an email address reuses an existing client with that email rather than
creating a duplicate. Deleted and archived clients are skipped in that search, since neither can
carry a new invoice.

A client created from here gets the name, contact, address, postal code, city, state and phone that
were supplied, and empty fields are omitted rather than sent as empty strings.

## Failure behaviour

Reads are wrapped: an unreachable InvoiceNinja produces a message on the page, not an error page.
Expense writes are best effort and never prevent the local record from being saved. Invoice
creation is not wrapped, because an invoice that silently failed to exist is worse than an error
message.

## Related

- [Invoicing a project](/projects/invoicing/)
- [Expenses](/money/expenses/)
- [The hub](/money/hub/)
- [Email, reminders and dunning](/money/email/)
