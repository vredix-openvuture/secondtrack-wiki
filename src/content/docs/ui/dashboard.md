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

## Tiles have a floor

Nothing on the dashboard scrolls, and nothing is cut off. Each tile has a minimum height measured
against what it actually renders at the narrowest width its column reaches, and that minimum is a
floor rather than a suggestion: the grid will not let you drag below it, and a layout saved before
a tile grew is raised to it when the page is drawn.

| Tile | Rows |
|---|---|
| Greeting | 2, it is a band |
| Finances, Warehouse, Open invoices, Quick access | 4 |
| Everything else | 3 |

The four at 4 earn it: finances carries a stat row more than the rest, quick access has six buttons
that fall into three rows once its column narrows, and the two quarter-width tiles wrap their stat
labels at that width.

Your arrangement is otherwise left alone. Only the height is raised, and only when it would
otherwise hide something.

## The logo

The logo tile shows an image you upload. Uploading a new one deletes the old file. Clearing it
removes both the setting and the file. Like every upload it is compressed to WebP.

## Keys

`g` then `d` from anywhere returns here. The full list is on
[Account, keys and the app](/ui/app/).
