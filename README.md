# Pantry

Tick off what is in your kitchen and see what you can cook tonight. Every
recipe is scored against your pantry on the server, and the list comes back
with the smallest shopping trip first — "Ready to cook" means nothing else is
needed.

## Live demo

Not deployed yet. The app renders on a server — filtering, streaming and
revalidation all happen there — so a static host would strip out the part
worth looking at. `vercel.json` is committed and the production build is
green; publishing is one `vercel` login away and nothing else.

To see it as it ships, run the production build locally:

```bash
npm ci && npm run build && npm start
```

## Running it

```bash
npm ci
npm run dev        # http://localhost:3000
```

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
npm run build      # production build
```

Everything works offline: if TheMealDB cannot be reached, the app uses the
recipes that ship with it and says so on the page.

## Deploy

The app needs a Node server — Vercel is the path of least resistance and
`vercel.json` is already committed (framework, install and build commands,
`fra1` region):

```bash
npx vercel --prod
```

Any host that runs `next start` works too:

```bash
npm ci && npm run build && npm start
```

A static export is deliberately not offered: it would drop the server-side
filtering, the streaming and the revalidation, which is most of what this
project is.
