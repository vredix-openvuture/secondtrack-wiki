---
title: Time and price
description: Logging work sessions, the three levels of hourly rate, and every figure in the project summary with the formula behind it.
sidebar:
  order: 3
---

## Work sessions

A session is a date, a number of hours, a description, and optionally a rate of its own. There is
no running timer: you write down what you did, usually at the end of the day.

| Field | Notes |
|---|---|
| **Date** | Defaults to today. An unparseable date falls back to today |
| **Hours** | A decimal. Both `1.5` and `1,5` are accepted |
| **Rate** | Empty means use the project or global rate |
| **Description** | Free text, and what appears in the Markdown export |

Sessions can be edited and deleted after the fact, because hours get mistyped and the day is often
only written up later. Clearing the rate field on an edit really does clear it, so the session goes
back to following the project rate.

## The three rate levels

Most specific wins.

| Level | Where | Applies when |
|---|---|---|
| Session | The rate on the session | It is filled |
| Project | The rate on the project | The session has none |
| Global | Settings, General | Neither has one |

The rate is not copied onto the session when it is logged. Changing the global rate therefore
re-prices every past session that did not set its own, which is usually what you want from a rate
change and occasionally a surprise on old projects.

## The summary

Every figure, and what feeds it.

| Figure | Formula |
|---|---|
| **Material cost** | Purchase price of every bought item, quantity included |
| **Advertising cost** | Purchase price of every item handed over free |
| **Item value** | Sale price of every item, quantity included |
| **Hours** | Sum over the sessions |
| **Labour value** | Per session, `hours × the rate that applies to it` |
| **Suggested price** | Item value + labour value |
| **List price** | The project's own price if set, otherwise the suggested price |
| **Gross profit** | List price − material cost − advertising cost |
| **Net profit** | Gross profit − labour value |

### Why purchase cost is not in the suggested price

The suggested price is what the build is worth: the resale value of the parts in it, plus your
time. What those parts cost you is already reflected in their sale prices. Adding it again would
charge the customer for the same parts twice, and the resulting number would not be a price, it
would be a price plus a margin nobody chose.

### Gross against net

Gross profit is what is left after the money that left your account for this build. Net profit is
what is left after also paying yourself for the hours. A project can be comfortably gross-positive
and net-negative, and that is exactly the case worth seeing: it made money on parts and lost it on
time.

### The legacy field

A project created before the warehouse existed carries its own purchase price. It is counted, into
both material cost and the suggested price, **only** while the project has no items at all. The
moment one item is assigned the field is ignored, because otherwise the same device would be
counted twice.

## The list price

Setting a list price on the project overrides the suggestion for every profit figure and for the
statistics. Leaving it empty means the suggestion is the price, which is the right default for a
build you have not yet decided how to sell.
