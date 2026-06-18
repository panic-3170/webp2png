# ToolKit.run — Web

Nuxt 3 + Vue 3 + Tailwind v4 implementation of the WebP → transparent PNG tool
described in `../doc/`. See:

- `../doc/WebP转PNG工具_需求文档.md` — PRD
- `../doc/开发计划.md` — development plan
- `../doc/UI设计.md` — UI specification

The original Figma-generated React code lives in `../figmaui/` and served as the
structural reference; this project is a from-scratch Nuxt rewrite aligned with
the UI design spec.

## Stack

- **Nuxt 3** (SSG via `nitro.preset = 'static'`)
- **Vue 3** (`<script setup lang="ts">`)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **lucide-vue-next** for icons
- **@nuxtjs/sitemap** for `sitemap.xml`

## Develop

```bash
cd web
pnpm install   # or: npm install
pnpm dev       # http://localhost:3000
```

## Generate static site

```bash
pnpm generate
# → .output/public/  (deploy to Cloudflare Pages / Netlify / any static host)
```

## Project structure

```
web/
├── app/
│   ├── app.vue                       # Root
│   ├── error.vue                     # 404 / error page
│   ├── assets/css/main.css           # Design tokens + Tailwind v4
│   ├── components/                   # 9 components (Header, Dropzone, …)
│   ├── composables/                  # useToast, useAnalytics, useWebpToPng
│   ├── layouts/default.vue           # Shell with Header/Footer/Toast
│   └── pages/                        # index / webp-to-png / privacy / about / contact
├── public/                           # robots.txt / ads.txt / favicon.svg
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

## Design tokens

All colors / spacing live in `app/assets/css/main.css` as `--tk-*` CSS
variables, exposed to Tailwind v4 via `@theme inline`. Light/dark are driven by
`prefers-color-scheme` (no manual toggle in v1).

To change the accent color or radius, edit `:root` in `main.css` only.

## Key flows

### WebP → PNG conversion

See `app/composables/useWebpToPng.ts`. Pipeline:

1. `createImageBitmap(file, { imageOrientation: 'from-image' })` — native decode, preserves alpha.
2. `OffscreenCanvas` rasterizes.
3. `convertToBlob({ type: 'image/png' })` — lossless output.

Throws `WebpConversionError` with a `code` (`NOT_WEBP` / `TOO_LARGE` /
`DECODE_FAILED` / `ENCODE_FAILED`) for typed handling in the UI.

### Dropzone

`components/Dropzone.vue` handles:

- Click → file picker
- Drag-and-drop with visual feedback (border + bg, no animation per UI spec)
- Keyboard activation (Enter / Space)
- Emits `oversize` for the parent to show a toast

## Deployment

`pnpm generate` produces a fully static bundle in `.output/public/`. Drop it
into Cloudflare Pages:

- Build command: `pnpm generate`
- Output dir: `.output/public`
- Node version: 20+

## What's not in v1

Per the development plan, deferred to later phases:

- Batch conversion (F5) — needs JSZip
- WASM fallback for very old browsers
- Manual dark-mode toggle
- Ezoic integration
- i18n
