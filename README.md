# Renaper Validation Frontend

Standalone public frontend for the academic Renaper Validation API. It is an original, institutional-inspired interface and is not an official RENAPER service. It only represents the project’s fictional-data simulator.

## Prerequisites

- Node.js 20.19+ or 22.12+ (current Vite requirement)
- npm

## Install and run

```bash
npm install
npm run dev
```

Vite prints the local URL after it starts. To build and locally inspect a production bundle:

```bash
npm run build
npm run preview
```

## Tests

```bash
npm test
```

The test suite uses Vitest, jsdom, and React Testing Library. The smoke test verifies that the public landing page and its account entry points render.

## API configuration

Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the API you want the future authentication client to use:

```bash
cp .env.example .env.local
```

For local development, the documented backend default is `http://localhost:5080`. This frontend currently does not call authentication, validation, API-key, or credit endpoints. The central configuration module at `src/config/environment.js` is the extension point for those future clients.

Never place tokens, API keys, database credentials, or other secrets in Vite environment files: `VITE_` variables are embedded in the browser bundle.

## Source layout

```text
src/
  app/          Application composition
  components/   Shared UI components and layouts
  config/       Public runtime configuration
  pages/        Route-level page components
  styles/       Central design tokens and global styles
  test/         Test runner setup
```
