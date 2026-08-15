# secondtrack-wiki

The documentation site for [secondtrack](https://github.com/vredix-openvuture/secondtrack), a
self-hosted cockpit for a refurbishing and repair business.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build): navigation
rail on the left, page contents on the right.

## Running it

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview
```

## Layout

```
src/
├── content/docs/       every page, one Markdown file each
│   ├── start/          installation and the first hour
│   ├── concepts/       how the pieces fit together
│   ├── warehouse/      stock, sets, categories, locations, codes and labels
│   ├── projects/       the container, its items, its price, its invoice
│   ├── money/          expenses, the hub, email, statistics
│   ├── shop/           WooCommerce orders and Vikunja tasks
│   ├── ui/             dashboard, style, account and the installed app
│   ├── integrations/   one page per connected system
│   ├── reference/      environment, settings, routes, data model, paths, jobs
│   └── help/           troubleshooting, FAQ, accessibility, development
├── styles/secondtrack.css   palette and rhythm on top of Starlight
└── assets/                  the wordmark
```

The sidebar is defined explicitly in `astro.config.mjs`, so the order is a decision rather than a
side effect of the filenames.

## Writing a page

Plain Markdown. Frontmatter needs `title` and `description`; `sidebar.order` sets the position
within its group.

```md
---
title: A page
description: One sentence, used as the meta description and the search snippet.
sidebar:
  order: 3
---
```

Callouts use Starlight's Markdown syntax so pages stay portable:

```md
:::note[Optional title]
Body.
:::
```

`note`, `tip`, `caution` and `danger` are available. A page that needs `<Steps>`, `<Tabs>` or the
card components must be `.mdx` and import them.

New pages have to be added to the sidebar in `astro.config.mjs`, or they exist but are unreachable.
A slug in the sidebar with no page behind it breaks the build, which is the built-in test.

## House style

- Short sentences. No filler, no marketing voice.
- Say what a thing does, then what it costs, then how to check it.
- Reference material belongs in tables. Explanations belong in prose.
- Document what the code does, not what it should do. Where something is unfinished, say so on the
  page rather than leaving the reader to discover it.
- Numbers and defaults belong in the text whenever they affect a decision.
