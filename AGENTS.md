# AGENT.md

## Purpose
This file is the working guide for Codex in this repository. Use it to keep implementation, test work, and cleanup consistent.

## Project Snapshot
- Framework: Next.js App Router (`next@15`), React 19, TypeScript.
- Styling: Tailwind CSS + custom classes in `src/app/globals.css`.
- Animation/UI libs: `framer-motion`, MUI Timeline components, `react-icons`.
- App type: single-page personal site with hash-based section navigation.
- Current scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- No test framework is currently configured.

## Codebase Map
- App shell and providers:
  - `src/app/layout.tsx` sets global layers (background, nav, content, footer).
  - `src/context/SectionVisibilityContext.tsx` stores current visible section.
  - `src/components/NavigationProvider.tsx` initializes hash and section state.
- Page composition:
  - `src/app/page.tsx` renders section wrappers in this order:
    `home -> about -> portfolio -> timeline -> skills`.
  - `src/components/SectionWrapper.tsx` handles vertical slide/opacity transitions.
- Navigation:
  - `src/components/DesktopNavigation.tsx` (wheel + keyboard navigation).
  - `src/components/MobileNavigation.tsx` (drawer + swipe + outside click).
- Sections:
  - `src/components/sections/*` for `Hero`, `About`, `Portfolio`, `Timeline`, `Skills`, `Footer`.
- Data-driven content:
  - `src/data/projects.ts`, `timelineData.ts`, `skills.ts`, `contact.ts`.

## Working Rules
- Keep existing section hash model (`#home`, `#about`, etc.) unless explicitly refactoring navigation architecture.
- Treat desktop and mobile flows as separate behavior surfaces; verify both when changing nav/interaction code.
- Preserve SSR-safe patterns around `window`/`document` access.
- Prefer small, focused edits over broad rewrites.
- Avoid introducing new UI libraries unless there is a clear gap.

## Testing Plan (Priority Order)
1. Add a test stack:
   - Unit/component: Vitest + React Testing Library + `jsdom`.
   - Optional e2e later: Playwright (only after critical unit coverage exists).
2. Cover core behavior first:
   - `SectionVisibilityContext`: defaulting + hash-change sync.
   - `NavigationProvider`: hash initialization and fallback to `#home`.
   - `SectionWrapper`: active section transform/opacity/z-index behavior.
   - Desktop navigation keyboard and wheel transitions.
   - Mobile nav open/close, escape, outside click, and swipe transition behavior.
3. Add regression tests for bugs found during cleanup.

## Bug/Cleanup Focus Areas
- Repeated utility hooks (`useWindowSize`, `useIsClient`) appear in multiple section files; candidate for shared hooks.
- Possible random-value hydration/consistency risks in `AnimatedDotsBackground` due per-render randomness.
- Navigation item definitions are duplicated across components; candidate for centralized shared constant.
- `sectionOrder` includes `contact` but no section exists in `page.tsx`; verify intent and either add/remove.
- Legacy/default README content does not match this app and should be replaced.

## Definition of Done for Changes
- `npm run lint` passes.
- Build passes (`npm run build`) for behavior-affecting changes.
- For new behavior, add or update tests in same PR/change set.
- Keep commits scoped to one theme: tests, bug fix, or refactor.

## Notes for Future Agents
- If starting a new task, first inspect `layout.tsx`, `SectionVisibilityContext.tsx`, and the relevant section component before editing.
- When fixing animation or nav issues, validate section state, URL hash, and transition lock (`isTransitioning`) together.
- Prefer data edits in `src/data/*` over hardcoding content in components.
