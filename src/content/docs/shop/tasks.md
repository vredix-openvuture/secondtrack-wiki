---
title: Tasks and boards
description: "The Vikunja view: which projects are surfaced, the list and Kanban modes, what can be edited from here, and linking a task to a project."
sidebar:
  order: 2
---

The Tasks page is a view onto Vikunja. Nothing about a task is stored in secondtrack except the
optional link from a task to a project.

## Which projects are shown

The Vikunja project you name in the settings, plus its subprojects. The parent is listed first and
treated as a task list of its own, because tasks sitting directly on it would otherwise be
invisible here.

The name is matched tolerantly: emoji, symbols and spacing are ignored, so a Vikunja project called
`🌞 OpenVuture` matches a configured name of `OpenVuture`. If nothing matches, every top-level
project is listed instead, which is a usable fallback rather than an empty page.

## The two views

| View | URL | Shows |
|---|---|---|
| **All open** | `/tasks` | Open tasks grouped by subproject, with counts. Subprojects with nothing open are omitted |
| **One board** | `/tasks?project=<id>` | Just that subproject |
| **Kanban** | `/tasks?project=<id>&view=kanban` | That subproject's buckets as columns |

Tasks are nested by their parent and subtask relations, within the set being displayed. A subtask
whose parent is not in the set, because the parent is done or in another project, is shown as a
root rather than hidden.

Kanban columns come from the Vikunja view's buckets, and cards can be dragged between them. Moving
a card into the view's done bucket marks the task done, and moving it out marks it open again, so
the placement survives a reload rather than snapping back.

:::note
Vikunja's bucket handling differs between versions. The page tries the newer view-scoped buckets
first, then the older direct bucket endpoint, then falls back to a flat list as a single column.
The last one is not a failure, it just means that Vikunja does not expose buckets the way the page
expects.
:::

## What can be edited from here

| Action | Notes |
|---|---|
| Tick a task done | From either view |
| Title and description | On the task detail |
| Priority | On the task detail |
| Due date | Clearing it really clears it, using Vikunja's zero timestamp |
| Labels | One field: type a name, and it is matched case-insensitively against existing labels or created |
| Remove a label | From the task detail |
| Move between buckets | Drag and drop on the Kanban view |

Creating a task is not possible here. The new-task button opens Vikunja.

The task detail shows everything Vikunja exposes for a task, including timestamps and assignees,
even where those cannot be edited from this side.

## Linking a task to a project

A Vikunja task can be linked to a secondtrack project, stored on the project as `vikunja_task_id`.
A task belongs to at most one project: linking it elsewhere clears the previous link first.

The link is a convenience, not a sync. Nothing about the task changes when the project changes, and
nothing about the project changes when the task is completed.

## Board backgrounds

A Vikunja project's background image is proxied through the server and cached for an hour, so the
Vikunja token never reaches the browser. A board without a background simply has none.

## When Vikunja is off

The page says so and shows nothing else. An error from Vikunja is displayed as text on the page.
Neither state affects anything else in the application, except that no fulfillment tasks are
created for shop orders.
