# account-migration-app (eval workspace)

A small React + Vite admin app used as a target for a repo-scale migration run.
It manages records through a domain model, a wire/API layer, local persistence,
and a handful of UI components, with supporting docs and fixtures.

This app is a test fixture for behavior exploration. The codebase is structured
so that a domain-language change touches many files while several compatibility
surfaces must deliberately stay unchanged.

## Setup

```bash
cd eval-workspace/account-migration-app
npm install
```

## Run the app

```bash
npm run dev
```

## Run the tests

```bash
npm test
```
