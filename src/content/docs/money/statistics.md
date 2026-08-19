---
title: Statistics
description: What the statistics page adds up, the difference between expected and actual money, and the period box.
sidebar:
  order: 4
---

The statistics page has two halves that answer different questions. The top is what your current
work is worth if it all sells. The bottom is what actually moved.

## Expected

Computed over every project, plus the warehouse.

| Figure | What it counts |
|---|---|
| **Total hours** | Every work session, everywhere |
| **Labour value** | Those hours at the rate that applied to each |
| **Material expenses** | Every project's material cost, plus the warehouse stock cost |
| **Warehouse stock cost** | What everything on the shelf cost |
| **Warehouse stock value** | What everything on the shelf is worth |
| **Advertising cost** | Every project's advertising cost |
| **Expected sale value** | The list price of every project not yet invoiced |
| **Expected gross profit** | Their gross profit |
| **Expected net profit** | The same, minus labour value |
| **Active, done, invoiced** | Project counts by status |

Everything here is an expectation. A project's list price is what you intend to charge, not what
anyone has paid.

Both come from the same calculation as the warehouse page: quantities multiplied in, purchase lots
counted at their invoice total, assemblies at the cost of what went into them, and no set counted
twice through its members. Whatever is on the shelf is in the figure, sellable or not.

## Actual

The period box is the only place that uses money that really moved.

| Side | Where it comes from |
|---|---|
| **Income** | InvoiceNinja invoices with a date in the period, counted as `amount − balance`, so only the paid part |
| **Expenses** | Local expenses with a date in the period |
| **Profit** | The difference |

The period switch is all, this year, or this month. This year means from January 1 to today, this
month from the 1st to today, not full calendar periods.

Income needs InvoiceNinja. Without it, income is zero and the box shows a loss equal to your
expenses, which is correct arithmetic on the data available and not a useful number.

## Why the two halves disagree

They are supposed to. A finished, unsold project contributes its full expected profit above and
nothing below. A sold one contributes nothing above, since it is invoiced, and its payment below.
Reading them together is the point: the top says what the shelf is worth, the bottom says what the
month did.

The formulas behind every figure on this page are on
[How the money is worked out](/concepts/money/).
