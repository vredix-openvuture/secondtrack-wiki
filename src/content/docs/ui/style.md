---
title: Style and wallpaper
description: Every appearance setting with its range and default, how the wallpaper is layered, and where the values are applied.
sidebar:
  order: 2
---

Settings, Style. Everything here is stored in the settings table and applied as CSS variables on
the next page load. There is no theme file to edit.

## The values

| Setting | Range | Default | Effect |
|---|---|---|---|
| **Accent** | Hex colour | `#fb6734` | The primary accent: active navigation, buttons, the wordmark |
| **Second accent** | Hex colour | `#ce3737` | Gradients and secondary emphasis |
| **Background** | Hex colour | `#26121b` | The page background, and the browser theme colour |
| **Radius** | 0 to 28 | 10 | Corner radius, in pixels, on cards and controls |
| **Font** | fredoka, system, mono, serif, rounded | fredoka | The interface font |
| **Density** | comfortable, compact | comfortable | Compact tightens spacing throughout |
| **Glass** | on, off | off | A translucent treatment on cards |
| **Card opacity** | 40 to 100 | 100 | How much of the wallpaper shows through a card |
| **Sidebar** | open, closed | closed | Whether the navigation starts expanded |

A colour that is not a valid hex value falls back to the default rather than being stored. Numbers
outside their range are clamped.

Fredoka is bundled as a web font, so it renders identically everywhere. The other four are system
stacks and depend on what the machine has.

## The wallpaper

An uploaded image, drawn behind everything, with two adjustments:

| Setting | Range | Default |
|---|---|---|
| **Blur** | 0 to 40 pixels | 0 |
| **Dim** | 0 to 95 percent | 40 |

The wallpaper sits at the bottom, a dimming layer over it, then the interface. Card opacity below
100 lets the result show through the cards themselves. Replacing the wallpaper deletes the old
file; clearing it removes the setting and the file.

Text over a busy photo is the failure case worth knowing about: raise the dim value, or the card
opacity, rather than picking a quieter picture.

## The sidebar

The sidebar collapses to icons and expands to icons with labels. Its state is remembered in the
browser, per device, and the setting above is only the default for a browser that has no stored
state yet.

The state is applied before the first paint, so it does not flicker on navigation.

On a narrow screen the sidebar becomes a drawer instead, opened by the button in the top left, so a
phone is not permanently narrower by the width of a navigation rail. The collapse control is hidden
there, since collapsing a drawer means nothing.

## Language

Settings, General. English and German, roughly 600 translated strings. English is the source
language, so anything untranslated appears in English.

:::caution
A handful of messages are hard-coded German regardless of the setting: some warehouse and project
status messages, the five invoice status labels in the hub, the fulfillment task text, and the
whole Markdown export. It is on the roadmap.
:::
