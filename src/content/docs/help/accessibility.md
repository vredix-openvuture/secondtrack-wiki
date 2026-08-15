---
title: Accessibility
description: What the interface does today, where it falls short, and the settings that help most in the meantime.
sidebar:
  order: 3
---

This page describes the state of things rather than an aspiration. Accessibility has not been
worked on deliberately, and several of the gaps below are known.

## What works

- **The pages are server-rendered HTML.** Navigation, forms and links work without JavaScript, and
  a screen reader gets real markup rather than a rebuilt widget tree.
- **Forms are plain forms.** Labels, native inputs, native validation. A submit is a submit.
- **The navigation is a list of links** with titles, and the icon-only collapsed state keeps those
  titles as tooltips and accessible names.
- **Keyboard shortcuts** cover navigation and creation. `Esc` closes any overlay. The full list is
  on [Account, keys and the app](/ui/app/).
- **Colour is adjustable.** Accent, second accent and background are free hex values, so contrast
  can be raised well past the default.
- **Density and radius are adjustable**, and card opacity can be taken to 100 so nothing shows
  through.

## Where it falls short

| Gap | Effect |
|---|---|
| **No focus-visible styling of its own** | Keyboard focus relies on the browser default, and on some backgrounds it is hard to see |
| **Dialogs are not focus-trapped** | Tab can leave an open dialog and land on the page behind it |
| **No reduced-motion handling** | Transitions run regardless of the system preference |
| **Drag and drop has no keyboard path** | The dashboard grid and the Kanban board can only be rearranged with a pointer |
| **Colour is sometimes the only signal** | Status badges and category tags carry text as well, but overdue and low-stock marks lean on colour |
| **No skip link** | Reaching the content means tabbing past the navigation on every page |
| **The default palette is low contrast in places** | Muted text on the dark background sits below the usual threshold |
| **Icon-only controls** | Some table actions are an icon with a title attribute and no visible text |

## Settings that help

| Setting | Set it to |
|---|---|
| Card opacity | 100, so no wallpaper shows through text |
| Wallpaper | None, or a high dim value |
| Accent | A colour with real contrast against the background, rather than one chosen to look good |
| Density | Comfortable, which gives larger touch targets |
| Font | System, if your system font is configured for readability |
| Sidebar | Open, so navigation items carry visible text rather than only icons |

Browser zoom works normally: the layout is responsive and reflows rather than scrolling
horizontally.

## On a tablet

Installing it as an app gives full-screen use with larger touch targets in the comfortable density.
The scan page's manual field accepts a handheld scanner, which avoids typing codes on a touch
keyboard entirely.

## Reporting something

Accessibility problems are bugs. If something here blocks you, an issue on the
[repository](https://github.com/vredix-openvuture/secondtrack) with the page and what you were
trying to do is the most useful form.
