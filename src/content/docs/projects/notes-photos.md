---
title: Notes, photos and export
description: Markdown reports with the slash menu, the reference photo gallery, how uploads are compressed, and the Obsidian export with its front matter.
sidebar:
  order: 4
---

## Markdown reports

A report is a titled note on a project. Several per project, newest first, edited in place.

The supported Markdown is deliberately small, because these are notes and not documents:

| Syntax | Result |
|---|---|
| `- [ ]` and `- [x]` | A task list with rendered checkboxes |
| `-` or `*` | A bullet list |
| `1.` | A numbered list |
| `#` to `###` | Headings |
| `**bold**`, `*italic*`, `` `code` `` | Inline formatting |
| A blank line | A new paragraph |

Anything else is treated as text. The input is HTML-escaped before any of it is applied, so a note
containing markup renders as the markup, not as a page element.

Typing `/` at the start of a line opens a small menu with four snippets: checklist, bullet list,
numbered list and heading. `Esc` closes it.

An empty title stays empty rather than being filled in with a word you never typed. The view falls
back to a neutral label.

## Reference photos

The gallery is for the photos that answer questions later: the condition at handover, the cable
routing before disassembly, the type plate. Several can be uploaded at once, since that is how they
are taken, and one caption applies to the batch. Captions are editable per image afterwards.

This is distinct from the project image, which is the single picture that identifies the project in
lists.

Deleting a gallery entry deletes the file with it. So does deleting the project.

## What happens to an upload

Every image, whether a project photo, a part image or a receipt, goes through the same path.

| Step | Detail |
|---|---|
| Accepted types | JPG, PNG, WebP, GIF, AVIF. Receipts additionally accept PDF |
| Size limit | 25 MB from the browser |
| Downscale | Longest edge 1600 pixels, or 2400 for a receipt, since a receipt has to stay readable |
| Re-encode | WebP at quality 82 |
| Kept as-is | Animated GIFs, anything Pillow cannot read, and any file that came out larger as WebP |
| Stored as | `/uploads/<prefix>-<16 hex characters><ext>` |

A phone photo is three to five megabytes and gets displayed a few hundred pixels wide. Storing the
original fills the data volume, and every backup, with detail nobody ever sees.

A rejected file gives a message naming the allowed types and the limit, rather than failing
silently.

## Markdown export

Two buttons on the project: download the file, or write it into the export directory. If that
directory is a mounted Obsidian vault, the second one puts the note straight into the vault. See
[Installation](/start/install/).

The filename is the project id padded to four digits plus a slug of the name, for example
`0007-thinkpad-t480.md`.

### What is in the file

YAML front matter, then the note.

```yaml
---
title: "ThinkPad T480"
type: secondtrack-projekt
status: in_progress
erstellt: 2026-08-15
materialkosten: 210.00
verkaufspreis: 450.00
arbeitsstunden: 3.50
stundensatz: 45.00
gewinn_brutto: 240.00
tags: [secondtrack]
---
```

Below it: the status and material cost, the description, the item table with its totals, the
reference photos, the work session table with its total, and the summary with suggested price, list
price and both profit figures.

The item table carries a quantity column, and both money columns are line totals for that quantity.
Without the column, nine of something reads as one.

A set appears as one row, exactly as it does on the page, since listing its members as well would
show and sum the same purchase twice.

:::caution
The exported document is in German: the front matter keys, the section headings and the column
labels. The rest of the application follows the language setting; this file does not.
:::

### Images in the export

Image links are absolute, built from the **public base URL** setting, because a relative
`/uploads/...` path means nothing once the file is sitting in a vault. Without that setting the
photo section is skipped entirely rather than exported broken.
