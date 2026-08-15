---
title: Vikunja
description: The API token, the parent project and how it is matched, what secondtrack reads and writes, and the version differences it works around.
sidebar:
  order: 3
---

Vikunja owns tasks. secondtrack displays them, edits a few fields, and creates fulfillment tasks
for shop orders.

## Setting it up

1. In Vikunja: **Settings, API Tokens**. It needs read access to projects and tasks, and write
   access for anything beyond viewing: ticking tasks, editing them, labels, buckets, and creating
   the fulfillment task and its board.
2. In secondtrack: **Settings, Connections, Vikunja**.

| Field | Default |
|---|---|
| **Enabled** | off |
| **URL** | |
| **Token** | Kept when submitted blank |
| **Parent project** | `OpenVuture` |

Requests go to `/api/v1` with a bearer token and a 20 second timeout.

## The parent project

The Tasks page shows that project and its subprojects. The name is matched after stripping
everything that is not a letter or digit and lowercasing, so `🌞 OpenVuture` matches a configured
`OpenVuture`.

If nothing matches, every top-level project is shown instead. That fallback is why a misspelt
parent name looks like it works: you get a task list, just not the one you meant.

## What it does

| Action | Direction |
|---|---|
| List projects, subprojects and their tasks | Read |
| Kanban buckets and moving a task between them | Read and write |
| Toggle done | Read and write |
| Edit title, description, priority and due date | Read and write |
| List, create, attach and detach labels | Read and write |
| Create a subproject and a task, for shop orders | Write |
| Fetch a project background image | Read |

Vikunja updates a task by posting the whole object back, so an edit is a fetch, a merge and a post.
That is why a partial edit does not clobber fields the form does not show.

Dates go over as RFC3339. Clearing a due date sends the zero timestamp `0001-01-01T00:00:00Z`,
which is how Vikunja represents unset.

## Version differences

Bucket handling has changed across Vikunja versions, and the page tries three routes in order:

1. The view-scoped buckets endpoint, which newer versions use, taking the tasks embedded in them.
2. The direct buckets endpoint, used by older versions.
3. A flat task list as a single column.

There is a fourth case: buckets exist but embed no tasks, and every task reports bucket id 0. Then
tasks are placed by their real bucket id where they have one, done tasks go to the view's done
bucket, and everything else to its default bucket.

Reaching case three is not an error. It means that Vikunja does not expose buckets the way the page
expects, and you get a usable list instead.

## The fulfillment task

Created by the shop order flow, not from the Tasks page. Its board and its on-off switch are on the
[WooCommerce settings tab](/integrations/woocommerce/), because they belong to the order flow.
Creation never breaks the order path: if Vikunja is unreachable, the receipt still goes out.

## Backgrounds

A project background is fetched server-side and served from `/tasks/project/{id}/background` with a
one hour cache, so the token stays on the server.

## Related

- [Tasks and boards](/shop/tasks/)
- [Shop orders](/shop/orders/)
