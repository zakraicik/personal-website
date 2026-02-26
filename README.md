# Personal Website

Single-page portfolio site built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and MUI timeline components.

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start local dev server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run Next.js ESLint checks
- `npm run test`: run Vitest unit tests once
- `npm run test:watch`: run Vitest in watch mode

## Project Structure

- `src/app`: App Router layout/page and global CSS
- `src/components`: navigation, wrappers, background, and section components
- `src/context`: section visibility context (hash-driven state)
- `src/data`: content/config data (projects, timeline, skills, contact, navigation)
- `src/hooks`: shared client/window hooks
- `tests/unit`: unit/component tests

## Navigation Model

The app is hash-driven and section-based (`#home`, `#about`, `#portfolio`, `#timeline`, `#skills`):

- URL hash is source of truth for active section.
- `SectionVisibilityContext` syncs hash changes into app state.
- `NavigationProvider` validates/falls back to `#home`.
- `SectionWrapper` handles per-section transition state.

## Testing

Current tests cover:

- `SectionVisibilityContext`
- `NavigationProvider`
- `SectionWrapper`
- `DesktopNavigation`

Run:

```bash
npm run test
```

## Notes

- The app no longer depends on runtime Google Fonts fetching for builds.
- See [AGENT.md](./AGENT.md) for implementation and cleanup guidance used during ongoing refactors.
