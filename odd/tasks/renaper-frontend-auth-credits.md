# Renaper frontend authentication and credits

## Objective

Create a React frontend for the Renaper Validation API with a public landing page, registration/login, and an authenticated management area.

## Problem and scope

The repository contains a .NET 8 API but no usable frontend. The UI must follow the visual quality and interaction patterns of the user's Norteware project without copying its branding, domain language, assets, or code.

Included:

- Public landing page with login and registration entry points.
- Registration, login, session persistence, and logout against the existing API.
- Authenticated management area showing account data, API-key actions, validation access, and a credits placeholder.
- A non-functional purchase-credits button until the external wallet contract exists.
- Responsive, accessible institutional-inspired visual design.

Excluded:

- Wallet/payment implementation.
- Credit balance, purchase, and consumption API integration; the backend does not yet provide it.
- Production-safe handling of browser-visible API keys; this is an explicit classroom-scope tradeoff.

## Constraints

- Direct SPA-to-API architecture.
- Hosted in the independent `Aguss2403/Renaper-Frontend-PAD` repository.
- Use an original blue institutional-inspired palette; do not claim official RENAPER branding.
- Do not expose unimplemented workflows as operational.
- TDD mode: disabled by user choice; run functional tests after each module.
- Delivery strategy: `ask-on-risk`; forecast approximately 450–650 authored lines, excluding generated assets.

## Tasks

- [x] FNT-01 — Bootstrap the frontend project, central design tokens, app shell, and test runner. Route: delegated (frontend setup spans multiple non-trivial files). Acceptance: development and test commands run; landing page renders. Evidence: `8ab3358` (`feat(frontend): bootstrap public landing`), `npm test` and `npm run build` passed.
- [x] FNT-02 — Build public landing, registration, and login flows against the existing API. Route: delegated (multiple UI, routing, state, and API files). Acceptance: users can register, log in, see API errors, restore a valid session, and log out. Evidence: `a06e38d` (`feat(auth): add account registration and login`), `npm test`, `npm run build`, and `git diff --check` passed. Risk: browser access remains blocked until the backend enables CORS.
- [ ] FNT-03 — Build the authenticated management area. Route: delegated (multiple non-trivial views/components). Acceptance: it shows account/API-key capabilities, validation access, and an explicitly disabled credits purchase placeholder.
- [ ] FNT-04 — Verify responsive/accessibility behavior and API error handling. Route: delegated (functional checks require fresh execution). Acceptance: relevant tests and build complete, with any unavailable backend-dependent checks documented.

## Verification

- Test runner: `npm test` (Vitest with jsdom and React Testing Library).
- Build command: `npm run build` (Vite).
- Manual scenarios: public navigation; valid/invalid registration; valid/invalid login; restored session; logout; protected-route redirect; disabled credit purchase action.

## Progress and evidence

- 2026-10-21: Created the frontend root and recorded scope from the user. No source files implemented yet.
- 2026-10-21: Set post-auth landing flow and selected functional tests instead of TDD.
- 2026-10-21: Moved the task document to the standalone frontend repository.
- 2026-10-21: Completed FNT-01 in commit `8ab3358`; independent verification and parent spot check passed.
- 2026-10-21: Completed FNT-02 in commit `a06e38d`; medium risk assessment was under the review budget and RDD is disabled. Parent test spot check passed.

## Next step

Execute FNT-03.
