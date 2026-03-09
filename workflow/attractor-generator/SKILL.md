---
name: attractor-generator
description: Generates a StrongDM Attractor DOT pipeline from user requirements. Use this when you need to define an AI workflow using the Attractor specification.
---

# Attractor Generator Skill

This skill translates a user's objective into a multi-stage AI workflow defined in Graphviz DOT syntax, strictly following the StrongDM Attractor NLSpec.

## Guidelines for Pipeline Generation

1. **Understand the Goal**: Identify the key tasks, decision points, and human-in-the-loop approvals needed for the user's objective.
2. **Graph Structure (DOT syntax)**:
   - Use `digraph G { ... }` or `digraph "Pipeline Name" { ... }`.
   - Node definitions use `[attrib=value]` syntax.
   - Edges use `->` syntax.
3. **Node Handlers (Class Attribute)**:
   - Assign nodes a `class` to define their behavior.
   - Examples: `class=codergen` (LLM task), `class=wait_for_human` (Interviewer gate), `class=parallel`, `class=bash`.
4. **Context & State Management**:
   - Nodes pass state via the pipeline context.
   - Edge labels like `[label="success"]` or `[label="failure"]` are used to route flow based on node execution outcomes.
5. **Human-in-the-Loop Requirements**:
   - For points requiring explicit user approval (e.g., Code Review), include a `wait_for_human` node.
   - Provide clear edge options exiting the human node (e.g., `Approve`, `Reject`, `Retry`).
6. **Testing and Environment Provisioning**:
   - **Unit Tests:** Always include an `init_test_environment` node (e.g., configuring `jsdom` or mock servers) *before* the `run_tests` node.
   - **Browser Tests:** For web applications, automatically insert a `run_browser_test` node (class `codergen`) *after* local unit tests for end-to-end visual testing.
   - **Dev Servers:** If browser testing is included, verify or add a local dev server script (e.g., `npm run dev`) that can serve the app locally so the browser agent has a valid target URL.

## Execution Steps

1. Analyze the user's request to identify the pipeline stages.
2. Formulate the DOT graph.
3. Save the DOT file to the project's workspace, typically under `attractor/pipelines/<pipeline_name>.dot`.
4. Once the DOT file is generated and saved, instruct the execution engine (Antigravity's `/attractor` workflow) to begin running the pipeline.
