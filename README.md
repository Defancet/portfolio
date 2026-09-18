# Portfolio

Personal portfolio site of Maksim Kalutski — a Vue 3 single-page app.

## Technologies Used

- **Vue 3** (Composition API, `<script setup>`) with **TypeScript**
- **Vue Router 5** — history mode
- **Vite** — dev server and build
- **Sass** — indented syntax, split into partials under `src/styles`
- **Matter.js** — physics for the draggable skill chips and about-page props, lazy-loaded on demand

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with hot reload on :5173 |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run build-only` | Build without the typecheck |
| `npm run preview` | Serve the built `dist/` on :4173 |
| `npm run typecheck` | `vue-tsc --noEmit` |
| `npm run format` | Format `src/` with Prettier |
| `npm run format:check` | Check formatting without writing |

> TypeScript is pinned to `^6.0.3`. `vue-tsc` cannot drive TypeScript 7 yet, so
> upgrading it breaks `npm run typecheck`.

## Project structure

```
src/
├── app/                  application shell
│   ├── component/        shared UI (CtaLink, ScrollUpButton, RouteProgress)
│   ├── composable/       scroll, active section, mobile menu, nav capsule,
│   │                       route pending, physics bodies
│   ├── data/             site-wide content (nav items, social links)
│   ├── directive/        v-reveal scroll animation
│   ├── layouts/          MainLayout, SiteHeader, SiteFooter
│   ├── router/           routes + Path/Name/Section enums
│   ├── service/          PhysicsWorld — the Matter.js half of the draggable bodies
│   └── util/             breakpoints, the page's own scroll animation, route prefetch
├── module/               features, one folder each
│   ├── home/             hero, intro, experience teaser, skills (physics chips)
│   ├── about/            long-form bio, plus three draggable props
│   ├── experience/       current role, highlights, project cards
│   └── contact/          form + thank-you page
├── styles/               Sass partials, one global stylesheet
└── assets/               fonts and images
```

## Configuration

`.env` holds the contact form endpoint:

```
VITE_FORMSUBMIT_ENDPOINT=https://formsubmit.co/<token>
```

It is committed rather than ignored, because a FormSubmit endpoint is public by
design — Vite inlines any `VITE_*` value into the bundle at build time, so it ends
up in the shipped JavaScript either way, and committing it keeps the build from
being deployable in a broken state. Secrets, if any are ever needed, belong in
`.env.local`, which is ignored.

The form's redirect target is resolved at runtime from the current origin, so no
per-environment URL configuration is needed.

## Deployment

The build is a static bundle in `dist/`. Because the router uses history mode,
**the server must rewrite unknown paths to `index.html`** or direct links to
`/about`, `/experience`, `/contact` and `/form-submitted` will 404.

`public/_redirects` carries that rewrite for Cloudflare Pages and Netlify, which
both read it. On any other host the rewrite has to be configured there — and note
that **GitHub Pages ignores `_redirects` entirely**, so it needs a copy of
`index.html` saved as `404.html` instead.

If you deploy under a sub-path instead of a domain root, change `base` in
`vite.config.ts` — the router reads it from `import.meta.env.BASE_URL`.
