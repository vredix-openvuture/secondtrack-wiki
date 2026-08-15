---
title: eBay
description: Developer keys, what the price suggestion actually measures, the marketplace setting, and where the number appears.
sidebar:
  order: 5
---

eBay supplies one thing: a rough market price next to the price field in the warehouse. It is the
smallest connection here, and the only one that never writes anywhere.

## Setting it up

1. At [developer.ebay.com](https://developer.ebay.com), create an application. You need the
   production **App ID**, which is the client id, and the **Cert ID**, which is the client secret.
2. In secondtrack: **Settings, Connections, eBay**.

| Field | Default |
|---|---|
| **Enabled** | off |
| **Client ID** | |
| **Client secret** | Kept when submitted blank |
| **Marketplace** | `EBAY_DE` |

The marketplace is an eBay marketplace id, `EBAY_DE`, `EBAY_US`, `EBAY_GB` and so on. It decides
which site the listings and the currency come from.

There is a test button. It looks up a fixed sample query and reports how many listings came back
and what the median was, which proves the credentials and the marketplace in one go.

## How the suggestion is made

1. A token is fetched with the client credentials grant, cached for about two hours in the process.
2. The Browse API is queried for up to 50 current listings matching the part name, filtered to used
   and seller-refurbished condition, fixed price only.
3. The suggestion is the **median asking price** of what came back.

The response also carries the minimum, the maximum, the count and the currency, so you can see how
wide the spread is behind the single number.

## What it is not

It is the median of what people are **asking**, not of what anything **sold** for. Sold prices are
not available through the Browse API. On a thin market with three optimistic listings, the number
will be optimistic too, which is why the count and the range are shown next to it.

It is also a suggestion and nothing more: it is never written to a part, and the field is not
pre-filled with it.

## Where it appears

The suggest button next to the sale price field in the warehouse create and edit forms. It is only
rendered when the connection is on.

Failures are returned as a message rather than an error page, including the case where the
connection is off, so the button never breaks the form it sits in.
