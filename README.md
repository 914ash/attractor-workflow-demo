# Attractor Workflow Demo

Attractor Workflow Demo is a methodology repo that shows how a DOT-defined AI workflow can move from requirements capture through implementation, testing, and browser validation on a small end-to-end app.

The bundled demo application is a minimalist habit tracker generated and validated through that workflow.

![Habit Tracker completed state](screenshots/habit-tracker-completed.png)

- **Status:** Demo repo
- **Stack:** Graphviz DOT workflow assets, JavaScript app, Vitest, workflow skills
- **Problem:** Agentic coding workflows become difficult to review when task boundaries, review gates, and failure handling are left implicit.

## What This Repo Demonstrates

- Pipeline generation from natural-language requirements
- Explicit node-to-node context tracking
- Browser validation inside the workflow loop
- Systematic debugging after test failures instead of blind retries

## Repository Layout

- `app/`: habit-tracker application used as the demonstration target
- `attractor/`: pipeline definition and run artifacts
- `workflow/`: reusable workflow and generator skill assets
- `docs/`: generated requirements and supporting notes

## Run The Demo App

```bash
cd app
npm install
npm run dev
```

Then open the local URL printed by the dev server.

## Run Tests

```bash
cd app
npm test
```

## Why This Repo Stays Public

This project is narrower than the main featured systems, but it is still useful as a compact example of graph-defined AI workflow orchestration with explicit review gates and browser validation.

## Attribution

This repo builds on the Attractor specification from StrongDM. It is an implementation and demo artifact, not a claim of upstream authorship.
