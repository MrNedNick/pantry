/** Single place for the copy that is not part of the app's own data. */
export const site = {
  name: 'Pantry',
  tagline: 'Cook from what you already have',
  repo: 'https://github.com/MrNedNick/pantry',
  readme: 'https://github.com/MrNedNick/pantry#readme',
  /**
   * The deployed origin, set at build time via `NEXT_PUBLIC_SITE_URL`. Empty
   * until the app is deployed: the footer hides its link and the pages leave
   * out a canonical rather than pointing one at localhost.
   */
  demo: process.env.NEXT_PUBLIC_SITE_URL ?? '',

  hero: {
    eyebrow: 'Recipe matching, computed on the server',
    title: 'Cook from what you already have',
    subtitle:
      'Tick off what is in your kitchen. Every recipe is scored against it and the list comes back with the smallest shopping trip on top — so the thing you can cook tonight is the first thing you see.',
    note: '24 recipes ship with the app and more are pulled from an open recipe database. Nothing to install, no account.',
    primaryCta: { href: '#pantry', label: 'Start with your kitchen' },
    secondaryCta: { href: '#how-it-works', label: 'How it works' },
  },

  howItWorks: {
    title: 'Three steps to dinner',
    steps: [
      {
        title: 'Tick what you have',
        description:
          '67 everyday ingredients, grouped the way a kitchen is: staples, vegetables, dairy, protein, spices. Search if the list is faster to type than to scan.',
      },
      {
        title: 'Read the gap, not the recipe',
        description:
          'Each card says what is missing and what you already have. “Ready to cook” means nothing else is needed — optional garnishes never count against a recipe.',
      },
      {
        title: 'Pick a few, take the list',
        description:
          'Picking recipes builds one shopping list with the duplicates added up and your pantry subtracted. The link in the address bar carries the whole thing to whoever is going to the shop.',
      },
    ],
  },

  underTheHood: {
    title: 'What happens where',
    intro:
      'The matching runs on the server, so the browser gets an answer instead of a database and a loop to run over it.',
    items: [
      {
        title: 'Server components do the filtering',
        description:
          'The recipe set and the scoring never reach the browser. What arrives is the rendered list — a few kilobytes of markup instead of the whole catalogue.',
      },
      {
        title: 'The page streams in two parts',
        description:
          'The header and the ingredient picker are sent as soon as they exist. The list follows behind a skeleton of its own shape once both recipe sources have answered, so nothing jumps when it lands.',
      },
      {
        title: 'The URL is the state',
        description:
          'Pantry and picks live in the querystring, which is why a selection can be shared, bookmarked and reloaded without a store, a session or a sign-in.',
      },
      {
        title: 'Recipe pages are pre-rendered',
        description:
          'The recipes that ship with the app are built as static pages and revalidated hourly; anything pulled from the open database is rendered on demand and cached after the first visit.',
      },
    ],
  },
} as const
