---
title: Codes, labels and scanning
description: How scan codes are built, what a code resolves to, the four label formats, printing through CUPS, and scanning with a camera or a handheld.
sidebar:
  order: 7
---

Every part, set and storage location carries a short code, assigned when it is created. The code is
what a label prints, what a scan resolves and what you read out over the phone.

## The shape of a code

```
CPU-3K7Q
└─┬ └─┬─
  │   └── four characters from an alphabet without 0, O, 1, I and L
  └────── three characters saying what it is
```

The suffix is drawn from `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, thirty-one characters with every
visually ambiguous one removed, so a code read off a smudged label cannot be mistyped into a
different valid one. Four characters give 923,521 combinations per prefix, and every generated code
is checked against parts, sets and locations before it is used.

The prefix comes from the object:

| Object | Prefix |
|---|---|
| A part in a category | The first three alphanumeric characters of the category name |
| A part with no category | `PRT` |
| Merch with no category | `MER` |
| A purchase lot | `SET` |
| A WIP assembly | `WIP` |
| A finished good | `PRD` |
| A storage location | `LOC` |

Finishing a WIP build issues a **new** code with the `PRD` prefix. The old label stops being valid,
which is the point: a finished product should not still be wearing a work-in-progress sticker.

## What a scan opens

`/s/<code>` resolves the code and redirects, so a phone camera pointed at a QR lands on the right
page without an app.

| The object is | You land on |
|---|---|
| On a project | That project |
| A part on the shelf | The warehouse, parts department, highlighted |
| Merch on the shelf | The warehouse, merch department, highlighted |
| A lot | The sets department, highlighted |
| A finished good or WIP build | The finished department, highlighted |
| A location | The location tree, highlighted |
| Unknown | The warehouse, with a not-found message |

Resolution is case-insensitive. The route needs a login like every other page, so a scan from a
logged-out phone lands on the login screen and continues afterwards.

## The label

Two by one inch at 203 dpi, the native resolution of the common thermal label printers, so the
image maps to printer dots one to one and nothing is rescaled on the way.

| Format | Layout |
|---|---|
| **QR** | The QR on the left, the code, name and location path on the right |
| **Barcode** | Code and name on top, a Code128 barcode across the full width |

The barcode gets the whole width because it has to. Code128 needs 123 modules for an eight
character code; squeezed next to text that is 0.18 mm per module, below the standard minimum and
finer than a single dot at 203 dpi, and nothing reads it.

The QR encodes the absolute `/s/<code>` URL, built from the **public base URL** setting. Without
that setting it falls back to the address the request came in on, which behind a reverse proxy is
usually an internal name and useless on a phone. Set it before printing anything.

## Getting the label out

| Route | URL | Use it when |
|---|---|---|
| View | `/label/<code>` | Checking it before printing |
| PNG | `/label/<code>.png` | Printing from a vendor app or an image viewer |
| PDF | `/label/<code>.pdf` | Anywhere the physical size has to be respected |
| SVG | `/label/<code>.svg` | Opening in a drawing program |
| Print | `POST /label/<code>/print` | Printing from the server through CUPS |

Add `?fmt=barcode` for the barcode variant; anything else is the QR.

The PDF exists because a PNG carries its physical size only as metadata, which most viewers ignore
in favour of assuming 96 dpi, at which point a 2 by 1 inch label prints at twice the size or
cropped. A PDF page size is binding.

## Printing from the server

The browser print pipeline is what produced blank labels: an application that does not speak the
driver's media vocabulary lets it fall back to its default page size, and a small label then shows
the empty corner of a much larger page. So the server submits the job itself, with the media size
set explicitly, and the browser is not involved. The same button therefore works from a tablet.

Configure it in **Settings, General**:

| Setting | Meaning | Default |
|---|---|---|
| Print host | The CUPS server. Empty means the local one | empty |
| Print queue | The printer name. **Empty means the print button does nothing but say so** | empty |
| Media | The PPD media keyword | `w144h72`, which is 144 by 72 PostScript points, that is 2 by 1 inch |

The container ships `cups-client` for this. If `lp` is missing the message says so, and the
download routes still work.

## Scanning

The scan page has two inputs that are really one.

- **The camera**, through the browser's barcode detector. It requires a secure context, so it needs
  HTTPS. Over plain HTTP the camera half is simply unavailable.
- **The field**, which accepts a typed code and, more usefully, a handheld USB or Bluetooth scanner,
  since those act as keyboards. No driver, no configuration.

Either way the code is resolved and you are redirected. An unknown code returns to the scan page
saying which code was not found, rather than dropping you somewhere with no explanation.
