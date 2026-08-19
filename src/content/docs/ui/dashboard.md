---
title: The dashboard
description: The ten tiles, how the grid layout is stored, which tiles need a connection, and how to reset the arrangement.
sidebar:
  order: 1
---

The home page is a grid you arrange. Ten tiles are available, each switched on or off and sized
individually.

## The tiles

| Tile | Shows | Needs |
|---|---|---|
| **Greeting** | Your display name or username | |
| **Finances** | The headline figures from the statistics | |
| **Active projects** | Up to six open or in-progress projects | |
| **Warehouse** | How many parts are on the shelf and what they are worth | |
| **Open invoices** | The InvoiceNinja KPIs | InvoiceNinja |
| **Shop orders** | Up to five recent orders | WooCommerce |
| **Tasks** | The number of open tasks | Vikunja |
| **Quick access** | Links into the main pages | |
| **Scan** | A shortcut to the scan page | |
| **Logo** | An image you upload | |

A tile whose connection is off is skipped when the page is built. A connection that errors leaves
the tile empty rather than breaking the page.

Only the data an enabled tile needs is fetched, so a dashboard without the invoice tile makes no
request to InvoiceNinja at all.

## Arranging it

Two layers, stored separately.

- **Which tiles, in what order, at what size.** Saved as a compact string, `welcome:4,finance:2,…`,
  where the number is a size from 1 to 4. This is what the checkbox and drag list under Customize
  writes.
- **The grid layout.** The exact x, y, width and height of every tile, saved as JSON when you drag
  or resize on the page itself, under Edit layout.

The grid wins where both exist. **Reset layout**, at the bottom of the Customize dialog, drops the
JSON so the tiles fall back to the arrangement below, which is the way out of an arrangement that
went wrong.

The default is
`welcome:4,finance:2,projects:2,warehouse:1,invoices:1,orders:2,tasks:1,quick:2,scan:1`, that is
everything except the logo tile.

### The fallback arrangement

Until you save a layout of your own, tiles are placed in reading order across a twelve column grid.
A size of 1 is three columns, 4 is the full width. Cards are three rows tall; the greeting is two,
so it reads as a band across the top rather than a large empty box, and the finances tile is
four, because it carries a row more than the others and does not fit three.

Rows are always filled: when the next tile does not fit in what is left of a row, the last tile in
that row grows to take the remainder. That matters because the grid floats, so a hole left in a row
would simply stay there. It is also why switching one widget off can make a neighbour wider.

## When a tile is too short

A tile is a fixed box and its content is not. Resize one until the content no longer fits and the
body is cut off at the bottom, while the link at the foot of the tile stays put: the way to the full
figures never disappears along with the figures.

Making it taller brings the rest back, and **Reset layout** returns every tile to a height that fits
what it renders.

## The logo

The logo tile shows an image you upload. Uploading a new one deletes the old file. Clearing it
removes both the setting and the file. Like every upload it is compressed to WebP.

## Keys

`g` then `d` from anywhere returns here. The full list is on
[Account, keys and the app](/ui/app/).
