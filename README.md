# Zak Raicik | Personal Website

A personal site for Zak Raicik, a machine learning leader and hands-on builder across insurance, finance, and AI security. Currently Head of Machine Learning at Evoke Security. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Development

Use Node.js 22.12+ and npm 10+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Development output uses `.next-dev`; production output uses `.next`, so a production build can run while the preview stays open.

## Checks

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm audit
```

Use `npm run test:watch` during development. Run `npm start` after a production build.

## Content and navigation

The four sections are `#home`, `#about`, `#timeline`, and `#skills`.

- `src/data/profile.ts`: introduction, bio, and focus areas
- `src/data/timelineData.ts`: employment and education, including optional months and company links
- `src/data/skills.ts`: skill categories and experience levels
- `src/data/contact.ts`: contact and social links
- `src/data/navigation.ts`: navigation labels and section order
- `src/data/projects.ts`: retained project content for possible future use; no project section is currently shown

`SectionVisibilityContext` validates hashes, synchronizes browser history, and owns the transition lock. All four sections fit inside the viewport. About uses topic buttons, Timeline shows one selected role with its complete, concise summary, and Skills is an interactive agent-style trace with selectable steps and tools paginated according to the available height. Compact selectors use branded modal pickers. Desktop arrow keys and wheel gestures switch sections; text inputs and open dialogs retain native keyboard behavior. Mobile uses a menu and swipe navigation, and modal dialogs provide native focus trapping. Inactive sections are inert and hidden from assistive technology. Reduced motion preferences disable animated transitions.

Tests cover hash validation, history synchronization, transition locking, desktop keyboard/wheel behavior, mobile navigation and swipe behavior, section accessibility, interactive skill-trace selection and pagination, About topics, branded pickers, and current employment dates.

## Security

Next.js and React are pinned to patched releases. Unused UI/chart/animation libraries have been removed. Two targeted npm overrides close vulnerabilities in transitive dependencies:

- `postcss`: applies the direct patched PostCSS version range to Next.js's older nested dependency, retaining Next.js 15.
- `@typescript-eslint/typescript-estree > minimatch`: uses patched minimatch 11, validated by the lint, type, and build checks.

Review the overrides when upgrading their parent packages. Keep the lockfile committed, install with `npm ci`, and rerun the audit after dependency changes.

Next.js sets framing restrictions, MIME sniffing protection, referrer and permissions policies, and a Content Security Policy. The CSP restricts resources to this origin and permits inline styles and Next.js hydration scripts to preserve static rendering. It is not a nonce-based script policy. Development additionally permits eval and WebSocket connections for hot reloading.

Relevant upstream advisories: [Next.js image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [PostCSS](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), and [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249).

## Vercel

No root `.env` is required to build or deploy this site. In a Git-connected Vercel project, a push to its configured branch triggers deployment.

The public URL for social metadata is resolved in this order:

1. `NEXT_PUBLIC_SITE_URL`, if set in Vercel's project environment settings
2. Vercel's automatic production/deployment URL
3. `http://localhost:3000` for local development

Set `NEXT_PUBLIC_SITE_URL` in Vercel when using a custom domain. Social sharing images are generated locally by `src/app/opengraph-image.tsx` without external font or asset requests.

See [AGENTS.md](./AGENTS.md) for repository working guidelines.
