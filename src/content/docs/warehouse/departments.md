---
title: The four departments
description: What each warehouse department holds, how the totals at the top are built, and how filtering and grouping the list works.
sidebar:
  order: 1
---

The warehouse page has four views, reached from the tabs at the top. Which one an object appears in
is decided by what it is, not by a setting you pick.

| Department | URL | Holds |
|---|---|---|
| **Parts** | `/warehouse?view=parts` | Loose parts and the members of a purchase lot |
| **Merch** | `/warehouse?view=merch` | Parts flagged as merch |
| **Sets** | `/warehouse?view=sets` | Purchase lots |
| **WIP** and **Finished** | `/warehouse?view=wip`, `?view=finished` | Assemblies, in progress and done |

## What counts as available

A part is available if it is loose or belongs to a purchase lot. A lot is a buying construct: its
parts are physically still on the shelf and can be taken individually, so they stay in the list.

A part that belongs to an assembly is consumed. It went into a build, and listing it as available
would mean promising the same component twice. Sets and parts assigned to a project have left the
shelf entirely and appear in neither list.

## The totals

The figures at the top cover all stock and ignore whatever filter is applied to the list below.
That is deliberate: the filter answers "show me the CPUs", not "recalculate my inventory as if only
CPUs existed".

| Figure | Counts |
|---|---|
| **Stock cost** | Loose bought parts, plus every lot's total, plus every assembly's cost |
| **Stock value** | Sale price of every part not consumed into an assembly, plus every finished good's price |
| **Low stock** | Products at or below their reorder level |
| **Merch value** and **given away** | Only in the merch department, see [Merch](/warehouse/merch/) |

A WIP build contributes cost but no value, because it is not sellable until it is finished. The
formulas are on [How the money is worked out](/concepts/money/).

## Filtering

| Filter | Parameter | Notes |
|---|---|---|
| Category | `cat=<id>` | |
| Supplier | `sup=<id>` | |
| Location | `loc=<id>` | Includes every location nested under it |
| Low stock only | `low=1` | Compares quantity against the reorder level |

Any of these hides the set-based departments, because they filter parts and a lot is not a part.

## Grouping

`group=location` or `group=category` splits the list into sections, each with its own count and
cost subtotal, so a shelf can be read shelf by shelf. Items with no location or category are
collected in an unlabelled section at the end.

## Arriving from somewhere else

Two parameters are set by other pages rather than typed:

| Parameter | Set by | Effect |
|---|---|---|
| `focus=<code>` | The scan resolver, and creating a set or finished good | Scrolls to and highlights that object |
| `for_project=<id>` | The New button on a project | Opens the create dialog and sends the finished item straight to that project |

`for_project` is how a project acquires an item without being able to create one. A project never
creates stock. It sends you to the warehouse and takes the result.
