# Attractor workflow demo

Attractor Workflow Demo shows how a DOT-defined AI workflow moves from requirements capture to implementation, testing and browser validation.

The bundled app is a minimalist habit tracker generated and checked through that workflow.

![Habit Tracker completed state](screenshots/habit-tracker-completed.png)

- **Status:** Demo repo
- **Stack:** Graphviz DOT workflow assets, JavaScript app, Vitest, workflow skills
- **Problem:** Agentic coding workflows are hard to review when task boundaries, review gates and failure handling stay implicit.

## What this repo demonstrates

- Pipeline generation from natural-language requirements
- Explicit node-to-node context tracking
- Browser validation inside the workflow loop
- Systematic debugging after test failures instead of blind retries

## Repository layout

- `app/`: habit-tracker application used as the demonstration target
- `attractor/`: pipeline definition and run artifacts
- `workflow/`: reusable workflow and generator skill assets
- `docs/`: generated requirements and supporting notes

## Run the demo app

```bash
cd app
npm install
npm run dev
```

Then open the local URL printed by the dev server.

## Run tests

```bash
cd app
npm test
```

## Why this repo stays public

This project is narrower than the main featured systems. It remains useful as a compact example of graph-defined AI workflow orchestration with explicit review gates and browser validation.

## Attribution

This repo builds on the Attractor specification from StrongDM. It is an implementation and demo artifact, not a claim of upstream authorship.
