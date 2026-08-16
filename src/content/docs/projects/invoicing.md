---
title: Invoicing a project
description: Turning a project into an InvoiceNinja invoice, what the line items look like, why the project number travels as the PO number, and how sending works.
sidebar:
  order: 5
---

secondtrack does not generate invoices. It asks InvoiceNinja to create one, which is what keeps
numbering, PDF rendering, tax and e-invoicing in a system built for them. See
[One home per fact](/concepts/one-home/).

The invoice panel only appears when the [InvoiceNinja connection](/integrations/invoiceninja/) is
on.

## Creating one

The button asks for a client. Three ways to supply it, in the order the app tries them:

1. **The project's customer.** If it is backed by an InvoiceNinja client, that client is used and
   nothing is asked.
2. **A client you pick** from the live list.
3. **A new client**, from the fields on the form: email, first and last name, company, address,
   postal code, city, state and phone. An existing client with that email is reused rather than
   duplicated.

## What is on it

One line per item, exactly the list the project page shows, then the hours.

| Line | Product key | Quantity | Cost |
|---|---|---|---|
| An item | Its name | The booked units | Its sale price per unit |
| A set | Its name | 1 | The set price, members not listed |
| A giveaway | Its name | The booked units | 0, with the note "Gratis" |
| The work | `Arbeitszeit` | The total hours | The hourly rate |

### The work line

Work is **one line**, however many sessions went into it. The sessions are listed inside its
description, oldest first, one per row:

```
12.08.2026 · Demontage der alten Lüfter (0,5 h)
12.08.2026 · Montage der neuen Lüfter (0,75 h)
13.08.2026 · Verdrahtung (0,75 h)
13.08.2026 · Inbetriebnahme und Funktionstest (0,5 h)
```

A session with no hours is left off. A session with no description shows its date and its hours.

The rate on that line is **weighted by hours**, not simply the project rate. A session can carry a
[rate of its own](/projects/time-and-price/), and the project's labour value honours it, so a
single line billing the project rate for every hour would hand the customer a total the project
never arrived at. Four hours at 45 plus one at 80 bill as 5 h at 52, not 5 h at 45.

Because the rate is printed with two decimals, a blended rate that does not land on a cent can put
the line total a cent away from the project's labour value. Nothing else can be done in one line;
the alternative is a wrong figure rather than a rounded one.

Nine fans are billed as nine at the price of one, not as one at nine times the price. The quantity
on the document is the quantity booked on the project.

Line totals match the project exactly, because prices are already
[stored at the cent](/warehouse/parts/) when the item is stocked. Nothing is rounded on the way to
the invoice, so there is no figure here that the project page does not also show.

An item's note travels into the line item's notes. A giveaway gets "Gratis" appended, so a line at
zero on the customer's document has a reason next to it.

The hours line only appears if hours were logged.

## The project number as PO number

The invoice carries the project number, `PJ-20260815-K4QW`, as its PO number. Nothing else internal
appears on it.

Public notes print on the customer's copy, so they are left empty rather than filled with a
database id. The link back from the invoice to the project lives in secondtrack's own link table,
where the customer never sees it.

## Only ever one

A project can have exactly one invoice raised from it. The link row is checked first, and a second
attempt returns the existing invoice rather than creating another. To raise a different one, delete
or regenerate the existing invoice first, both described below.

## The number shown is the number on the document

The invoice number belongs to InvoiceNinja, so opening the project re-reads it from there rather
than showing what was recorded when the invoice was raised. Change a number in InvoiceNinja and the
project agrees with the PDF again on the next look. The amount and the status travel the same way.

If InvoiceNinja cannot be reached, the last known number is shown rather than nothing. If
InvoiceNinja says the invoice does not exist, the project says so instead of naming a document
nobody can open, and offers the two ways out: raise a new one, or remove the link so the project is
free to be invoiced again.

## Checking it

Once an invoice exists, the project shows **Check invoice**. It opens the document itself, in a
dialog, with everything you can do to it in one place. There is no reason to send an invoice you
have not looked at, so looking at it is the route to sending it.

| Action | What it does |
|---|---|
| **Send to customer** | Goes to the confirmation described below |
| **Download PDF** | The same file, as a download |
| **Regenerate** | Rebuilds the positions from the project as it is now, keeping the invoice |
| **Delete invoice** | Deletes it in InvoiceNinja and here |

The PDF is fetched from InvoiceNinja when the dialog opens, not when the page loads. A project page
therefore costs no InvoiceNinja request until you ask for one.

If the PDF cannot be fetched, the frame says why instead of sitting empty. The usual cause is that
the invoice was deleted in InvoiceNinja, in which case delete it here too and raise a new one.

### Regenerate

The invoice is rewritten where it is: the line items are rebuilt from the project's current items
and hours, and everything else about the document stays. It is the way to correct an invoice after
fixing what was wrong on the project.

- **The number stays**, and so do the id and the client. A rebuilt invoice is the same invoice with
  its positions corrected, not a new document. Replacing it would consume a number from your
  sequence on every correction and leave a deleted invoice behind for each one.
- **A copy already sent becomes outdated.** The send timestamp is not cleared, because the mail did
  go out; what the customer holds simply no longer matches. Send it again, or say so.

Regenerating an invoice InvoiceNinja will not accept a change to, a paid one for instance, fails
with the reason it gave rather than half-applying anything.

### Delete

Deletes it in InvoiceNinja and removes the link row here, which is what frees the project to be
invoiced again.

If InvoiceNinja cannot be reached, nothing is removed locally either, and the page says why. That
is deliberate: a link row deleted while the invoice still exists would leave an invoice nothing
points at, and let the project raise a second one.

:::caution
Deleting an invoice that has already been sent is possible and not prevented. The customer has a
copy of a document that no longer exists on your side. For a real correction, a credit note in
InvoiceNinja is the right instrument.
:::

## Sending

If auto-send is on, the invoice is emailed the moment it is created. Otherwise the send button on
the project does it.

### The confirmation

**Send to customer** does not send. It shows who the mail would go to, read live from InvoiceNinja
at that moment, so what you approve is the address the mail actually uses rather than what was
typed into the project weeks ago.

| Shown | From |
|---|---|
| Email | The first client contact that has one. **This is the address that receives it** |
| Contact, company, address, phone, VAT number | The InvoiceNinja client |
| Invoice number, amount, open balance, invoice date, due date | The invoice |
| Already sent | The local send timestamp, if it went out before |
| How it will be sent | Your own SMTP with the PDF attached, or InvoiceNinja's own mail |

A field with no value is left out rather than shown empty.

Sending is blocked, with the reason on screen, in two cases: the client has no email address, or no
[sending provider](/money/email/) is configured. Neither is something the send itself could
recover from.

Which route the mail takes depends on the email provider setting:

| Provider | What happens |
|---|---|
| **secondtrack** | The app composes the mail from your template, attaches the PDF it downloaded from InvoiceNinja, sends it over your SMTP, and marks the invoice as sent so it leaves draft state |
| **InvoiceNinja** | InvoiceNinja sends it with its own template and its own SMTP |

Either way the send time is recorded on the link row, which is what the reminder and dunning logic
reads later. See [Email, reminders and dunning](/money/email/).

If [Nextcloud auto-archive](/integrations/nextcloud/) is on, the PDF is filed away after sending.
An archiving failure never breaks the send.

## When it is not a customer job

An in-house build is not invoiced from here. It goes onto the shelf as a finished good and is sold
through the shop, at which point the [order flow](/shop/orders/) creates the paid document. That
route requires a project type with the shop-stock flag, described in
[What a project is](/projects/overview/).
