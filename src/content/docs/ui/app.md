---
title: Account, keys and the app
description: The login and two-factor enrolment, every keyboard shortcut, and what installing it as an app does and deliberately does not cache.
sidebar:
  order: 3
---

## The account

There is one. It is created on first start from `SECONDTRACK_ADMIN_USER` and
`SECONDTRACK_ADMIN_PASSWORD`, and those variables are never read again.

| Action | Where |
|---|---|
| Change the password | Settings, Account. Minimum six characters, and the current one is required |
| Set a display name | Settings, General. Used in the greeting |
| Enable two-factor | Settings, Account |

Passwords are hashed with bcrypt. The session lives in a signed cookie, using
`SECONDTRACK_SECRET_KEY`, and `SECONDTRACK_COOKIE_SECURE=1` restricts it to HTTPS.

:::caution
There is no password reset. Losing the password means editing the database, or deleting the user
row so the first-start seed runs again.
:::

## Two-factor

Standard TOTP, works with any authenticator app.

1. Start the enrolment. A QR code appears once, along with the secret behind it.
2. Scan it and type a current code back.
3. Only if that code verifies is two-factor switched on.

That last step is the point: the app cannot be enabled for a secret you never actually stored.

At login, the password step then hands over to a code step, and the session is not considered
authenticated until the code is accepted. A half-finished login cannot reach any page. Codes from
one step either side of the current one are accepted, so a slightly wrong clock still works.

Disabling two-factor requires the password.

## Keyboard shortcuts

<kbd>Ctrl</kbd> <kbd>/</kbd> opens the list from anywhere.

| Keys | Does |
|---|---|
| <kbd>Ctrl</kbd> <kbd>/</kbd> | Show the shortcut list |
| <kbd>g</kbd> then <kbd>d</kbd> | Dashboard |
| <kbd>g</kbd> then <kbd>p</kbd> | Projects |
| <kbd>g</kbd> then <kbd>w</kbd> | Warehouse |
| <kbd>g</kbd> then <kbd>h</kbd> | Finances |
| <kbd>g</kbd> then <kbd>t</kbd> | Tasks |
| <kbd>g</kbd> then <kbd>s</kbd> | Statistics |
| <kbd>n</kbd> | Create, meaning whatever the current page creates |
| <kbd>v</kbd> | Switch between list and card view, on projects and the warehouse |
| <kbd>Esc</kbd> | Close the overlay, dialog or menu |

## Installing it

The application ships a web manifest and can be installed from a browser, which is what makes it
usable as a workshop tablet: full screen, its own icon, and shortcuts into projects, warehouse and
tasks from a long press on that icon.

The service worker is deliberately narrow.

| Request | Behaviour |
|---|---|
| `/static/...` | Cached, served from cache first. Versioned by the asset token, so a deploy replaces them |
| `/uploads/...` | Never cached. It is user data |
| Any page | Network only. Offline shows a short notice with a retry button |

Pages are behind a login and full of customer data. Caching them would leave that data on the
device for whoever picks the tablet up next, and an offline copy is not worth that. The offline
notice is not a degraded version of the app, it is a message saying the server is unreachable.

Cache entries from an older version are deleted when the new worker activates.

## Small conveniences

- Price fields accept both `12,50` and `12.50` and are normalised on the way out.
- Status messages fade after five seconds, or on a click.
- Image inputs preview the picked file before it is uploaded.
- The camera on the scan page needs HTTPS. Over plain HTTP only the manual field works, which is
  also what a handheld scanner types into.
