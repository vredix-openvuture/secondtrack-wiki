---
title: How the money is worked out
description: Every formula the app uses, on one page, with what feeds each figure and where the numbers can surprise you.
sidebar:
  order: 3
---

Every figure on a project page, in the statistics and on an invoice comes from the formulas below.
If a number looks wrong, this page is where to check first.

## Per project

The calculation reads one list: the items assigned to the project, plus the work sessions logged on
it. Nothing else contributes.

| Figure | Formula |
|---|---|
| **Material cost** | Sum of the purchase price of every bought item, quantity included |
| **Advertising cost** | Sum of the purchase price of every item handed over free |
| **Item value** | Sum of the sale price of every item, quantity included |
| **Hours** | Sum of the hours of every work session |
| **Labour value** | Sum of `hours × rate` per session, each session using its own rate if it has one |
| **Suggested price** | Item value + labour value |
| **List price** | The project's own sale price if set, otherwise the suggested price |
| **Gross profit** | List price − material cost − advertising cost |
| **Net profit** | Gross profit − labour value |

Two figures behave differently from the rest and are worth reading twice.

- **Purchase cost is not added to the suggested price.** The suggested price is built from what the
  items are worth on resale plus your labour. Adding what they cost you as well would charge the
  customer twice for the same parts.
- **A giveaway contributes nothing to material cost and nothing to value.** It is billed at zero,
  and its purchase price appears as advertising cost instead. See [Merch](/warehouse/merch/).

## The hourly rate

Three levels, most specific first.

| Level | Set in | Used when |
|---|---|---|
| Session | The rate field on a work session | It is filled |
| Project | The rate field on the project | The session has none |
| Global | Settings, General | Neither has one |

Changing the global rate re-prices every past session that did not override it, because the rate is
not copied onto the session when it is logged. That is usually what you want and occasionally a
surprise.

## A legacy field

`Project.purchase_price` comes from before the warehouse existed, when the project itself was the
device. It is added to the material cost, and to the suggested price, **only** for a project that
has no items at all. As soon as one item is assigned, the field is ignored, because otherwise the
same device would be counted both as the project's own price and as an item on it.

## Across all projects

The statistics page adds them up, and adds the warehouse.

| Figure | What it is |
|---|---|
| **Total hours** and **labour value** | Sums over every project |
| **Warehouse stock cost** | What the shelf cost, the same figure the warehouse page shows |
| **Material expenses** | Every project's material cost, plus the warehouse stock cost |
| **Advertising cost** | Every project's advertising cost |
| **Expected sale value** | List price of every project that is not yet invoiced |
| **Expected gross and net profit** | The same projects' gross and net profit |
| **Active, done, invoiced** | Project counts by status |

Advertising cost has its own line for a reason: a giveaway has left the shelf and is no longer
material cost anywhere, so without a figure of its own that money would simply vanish from the
totals.

## Profit and loss

The period box on the statistics page is a different calculation, and it is the only one that uses
real money rather than expected money.

| Side | Source |
|---|---|
| **Income** | InvoiceNinja invoices in the period, `amount − balance`, so only what was actually paid |
| **Expenses** | Local expenses with a date in the period |
| **Profit** | Income − expenses |

It needs InvoiceNinja. Without it the income side is zero and the box shows a loss equal to your
expenses.

## In the warehouse

One calculation feeds the warehouse page, the statistics and the dashboard tile, so the three can
never report different totals for the same shelf. The figures cover all stock and are not affected
by the filter applied to the list below.

| Figure | What is counted |
|---|---|
| **Stock cost** | Loose bought parts, plus each lot's total, plus each assembly's cost. WIP builds tie up material too |
| **Stock value** | Sale price of every part not consumed into an assembly, plus each finished good's price. A WIP build has no value yet, because it is not sellable |
| **Merch value** | Sale price of everything in the merch department |
| **Given away** | Purchase price of every item ever handed over free |

An assembly's cost is recomputed from its booked components whenever one is added or removed. A
finished good registered directly from a project starts with the project's material cost as an
estimate, and takes on the real figure as its components are booked onto it.
