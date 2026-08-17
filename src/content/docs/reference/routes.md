---
title: Routes
description: Every URL the application answers, what it does, and which ones need a login.
sidebar:
  order: 3
---

Every route requires a login except the four marked below. An unauthenticated request to a page is
redirected to `/login`; one carrying an `HX-Request` header gets a 401 instead.

## Open routes

| Method | Path | Notes |
|---|---|---|
| GET | `/login` | The login form |
| POST | `/login`, `/login/2fa` | The two login steps |
| GET | `/healthz` | Returns `{"status": "ok"}` |
| GET | `/sw.js` | The service worker, fetched before any session exists |
| POST | `/webhooks/woo` | Verified by HMAC signature instead of by session |

## Dashboard

| Method | Path | Does |
|---|---|---|
| GET | `/` | The dashboard |
| POST | `/dashboard/widgets` | Which tiles, in what order, at what size |
| POST | `/dashboard/layout` | The grid, as JSON. Returns `{"ok": true}` |
| POST | `/dashboard/layout/reset` | Drops the grid |
| POST | `/dashboard/logo`, `/dashboard/logo/clear` | The logo tile image |
| POST | `/logout` | Clears the session |

## Warehouse

| Method | Path | Does |
|---|---|---|
| GET | `/warehouse` | The list. Parameters `view`, `cat`, `sup`, `loc`, `low`, `group`, `for_project`, `focus` |
| GET | `/warehouse/price-suggest?q=` | The eBay suggestion, as JSON |
| GET | `/warehouse/{id}/json` | One part, for the edit dialog |
| POST | `/warehouse` | Create a part, or a set if member rows were submitted |
| POST | `/warehouse/{id}/update` | Edit a part |
| POST | `/warehouse/{id}/split` | Turn a part into a lot |
| POST | `/warehouse/{id}/install` | Assign the whole row to a project |
| POST | `/warehouse/{id}/book` | Book units, with a quantity and sold or free |
| POST | `/warehouse/{id}/merch` | Move between the parts and merch departments |
| POST | `/warehouse/{id}/move` | Change the storage location |
| POST | `/warehouse/{id}/delete` | Delete a part |

### Sets

| Method | Path | Does |
|---|---|---|
| POST | `/warehouse/set` | Create a purchase lot |
| GET | `/warehouse/set/{id}/json` | One set, with members and available parts |
| POST | `/warehouse/set/{id}/update` | Edit a finished good |
| POST | `/warehouse/set/{id}/update-lot` | Edit a lot, and add members |
| POST | `/warehouse/set/{id}/delete` | Delete a set, releasing its parts |
| POST | `/warehouse/finished` | Create an empty finished good |
| POST | `/warehouse/wip` | Create a WIP assembly |
| POST | `/warehouse/set/{id}/finish` | WIP to finished, with a new `PRD` code |
| POST | `/warehouse/set/{id}/add-part` | Book a component onto a build |
| POST | `/warehouse/set/{id}/remove-part` | Un-book one |
| POST | `/warehouse/set/{id}/member/add` | Add a bare member row |
| POST | `/warehouse/set/{id}/member/{part}/save` | Rename or reprice a member |
| POST | `/warehouse/set/{id}/member/{part}/remove` | Delete a member |
| POST | `/warehouse/stock-from-project/{project}` | Register a finished project as a finished good |

### Locations and suppliers

| Method | Path |
|---|---|
| GET, POST | `/warehouse/locations` |
| POST | `/warehouse/locations/{id}/update`, `/delete` |
| GET, POST | `/warehouse/suppliers` |
| POST | `/warehouse/suppliers/{id}/update`, `/delete` |

## Scanning and labels

| Method | Path | Does |
|---|---|---|
| GET | `/scan` | The scan page. `?code=` resolves directly |
| GET | `/s/{code}` | Resolve a code and redirect to the object |
| GET | `/label/{code}` | The label page. `?fmt=barcode` for the barcode variant |
| GET | `/label/{code}.png`, `.pdf`, `.svg` | The label as a file |
| POST | `/label/{code}/print` | Submit it to the CUPS queue |

## Projects

| Method | Path | Does |
|---|---|---|
| GET | `/projects` | The list. `?status=active|done|invoiced` |
| POST | `/projects` | Create one |
| GET | `/projects/{id}` | The detail page |
| POST | `/projects/{id}/update`, `/delete` | |
| POST | `/projects/{id}/items/assign` | Assign a part or a set, with a quantity and a free flag |
| POST | `/projects/{id}/items/part/{part}/qty` | Change the booked quantity |
| POST | `/projects/{id}/items/set/{set}/release` | Send a set back |
| POST | `/projects/{id}/parts/{part}/remove` | Send a part back |
| POST | `/projects/{id}/expenses/assign` | Book an existing expense onto it |
| POST | `/projects/{id}/sessions` | Log a work session |
| POST | `/projects/{id}/sessions/{s}/update`, `/delete` | |
| POST | `/projects/{id}/reports` | Add a report |
| POST | `/projects/{id}/reports/{r}/update`, `/delete` | |
| POST | `/projects/{id}/gallery` | Upload reference photos |
| POST | `/projects/{id}/gallery/{img}/update`, `/delete` | |
| GET | `/projects/{id}/export.md` | Download the Markdown |
| POST | `/projects/{id}/export` | Write it into the export directory |
| POST | `/projects/{id}/invoice` | Create the InvoiceNinja invoice |
| GET | `/projects/{id}/invoice.pdf` | The PDF, inline, for the review dialog |
| GET | `/projects/{id}/invoice/recipient` | Who it would go to, as JSON, for the send confirmation |
| POST | `/projects/{id}/invoice/send` | Email it |
| POST | `/projects/{id}/invoice/regenerate` | Delete it and raise a fresh one |
| POST | `/projects/{id}/invoice/delete` | Delete it in InvoiceNinja and here |
| POST | `/projects/{id}/invoice/paid` | Record the payment, in InvoiceNinja too |
| POST | `/projects/{id}/archive` | File a paid project away |

## Expenses

| Method | Path |
|---|---|
| GET, POST | `/expenses` |
| POST | `/expenses/{id}/update`, `/delete` |
| POST | `/expenses/resync` |

## Hub

| Method | Path | Does |
|---|---|---|
| GET | `/hub` | Parameters `drafts`, `archived`, `period` |
| POST | `/hub/orders/{id}/invoice` | Create an invoice for an order |
| POST | `/hub/invoice/{link}/send` | `?kind=invoice|reminder|dunning` |
| POST | `/hub/invoice/{link}/archive` | Upload the PDF to Nextcloud |
| POST | `/hub/in/{invoice}/mail` | Mail by InvoiceNinja id, without a link row |
| POST | `/hub/archive-paid` | Run the Nextcloud sync now |
| POST | `/hub/poll-orders` | Run the order check now |
| POST | `/hub/process-due` | Run the reminder and dunning pass now |

## Tasks

| Method | Path | Does |
|---|---|---|
| GET | `/tasks` | Parameters `project`, `view` |
| GET | `/tasks/{id}` | Task detail. `?back=` for the return link |
| POST | `/tasks/{id}/toggle` | Done state |
| POST | `/tasks/{id}/update` | Title, description, priority, due date |
| POST | `/tasks/{id}/labels/add`, `/labels/{label}/remove` | |
| POST | `/tasks/{id}/assign` | Link to a project, empty clears it |
| POST | `/tasks/{id}/bucket` | Move to a Kanban bucket. 204 on success |
| GET | `/tasks/project/{id}/background` | Proxied board background |

## Statistics

| Method | Path |
|---|---|
| GET | `/stats`, `?period=all|year|month` |

## Settings

| Method | Path | Does |
|---|---|---|
| GET | `/settings` | Parameters `tab` and `sub` |
| POST | `/settings/general` | Rate, currency, language, base URL, printer |
| POST | `/settings/style` | Colours, radius, font, density, glass, opacity, sidebar |
| POST | `/settings/wallpaper`, `/wallpaper/clear` | |
| POST | `/settings/password` | |
| POST | `/settings/2fa/start`, `/2fa/enable`, `/2fa/disable` | |
| POST | `/settings/optional-fields` | The global optional field schema |
| POST | `/settings/connection/woo`, `/in`, `/vikunja`, `/nextcloud`, `/ebay`, `/email` | |
| POST | `/settings/connection/nextcloud/test`, `/ebay/test` | |
| POST | `/settings/email/test` | Send a test message |
| GET | `/settings/categories` | The category editor |
| GET | `/settings/categories/{id}/fields` | One category's field schema, as JSON |
| POST | `/settings/categories`, `/{id}/update`, `/{id}/delete` | |

## Static

| Path | Serves |
|---|---|
| `/static/...` | CSS, JavaScript, fonts, icons. Versioned by `?v=` |
| `/uploads/...` | Uploaded images and receipts |
