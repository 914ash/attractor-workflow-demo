---
description: A structured workflow to run StrongDM's Attractor context-driven DOT pipelines seamlessly within Antigravity.
---
# Attractor Workflow

This workflow orchestrates multi-stage AI tasks by defining and executing them as directed graphs (DOT syntax) according to the StrongDM Attractor NLSpec. Antigravity acts as both the Pipeline Execution Engine and the Codergen backend, seamlessly running the stages, managing state, and integrating Human-in-the-Loop gates.

## Stage 1: Pipeline Generation (Setup)
**Goal:** Translate user requirements into a DOT graph and establish the run context.
1. Read the user's main objective and determine if a pipeline DOT file already exists.
2. If one does not exist or needs modification, activate the `attractor-generator` skill to formulate the workflow as a DOT graph in `attractor/pipelines/`.
3. Validate the DOT pipeline to ensure all edges are logically connected, terminal nodes exist, and it conforms to the Attractor subset of DOT syntax.
4. Create a run directory `attractor/runs/<run_id>/` and initialize a `context.md` file to track state, variables, and context.

## Stage 2: Execution Engine Loop 
**Goal:** Traverse the graph deterministically, updating context at each node.
1. Start at the `start` node.
2. **Context Logging (Mandatory):** You MUST update the state of the current node in the `context.md` file (e.g., `PENDING` -> `IN_PROGRESS`) *before* executing the node work, and immediately update it to `SUCCESS` or `ERROR` *after* completion.
3. For the current node, identify its handler type (e.g. from node shape or class attributes):
    - **Codergen (LLM Task):** Antigravity executes the specific coding task required by this node using its own standard loop (e.g., TDD, implementation). Update `context.md` with the outcome.
    - **Wait For Human (Interviewer):** Antigravity MUST pause and use the `notify_user` tool to present the user with the options defined in the node. Wait for the user's decision before routing to the next edge.
    - **Parallel / Fan-In:** If supported by the current context, execute sub-tasks and gather results before proceeding.
    - **Tool / Bash Node:** Execute any specific scripts, shell commands, or verifications required.
4. **Handling Background Processes:** If a node requires a local server or service, start it as a background command using `run_command` with a high `WaitMsBeforeAsync`, verify it is running over an available port, execute the dependent node(s), and then explicitly terminate the background server when it is no longer needed.
5. After completing the node, save a checkpoint in `attractor/runs/<run_id>/checkpoint.md` with the completed node ID and current context state.
6. Evaluate edge conditions to select the next node, preferring edges labeled with the outcome of the current node (e.g., `success`, `failure`).
7. **Handling Failures:** If a node falls into an `error` state and loops back to a previous implementation node, first utilize the `systematic-debugging` skill to determine *why* the failure occurred (e.g., test config vs logic bug) before blindly restarting implementation.

## Stage 3: Human-in-the-Loop Gates (Interviewer Pattern)
**Goal:** Ensure seamless integration of human approvals without breaking the agentic loop.
1. When encountering a node requiring human validation, format the request clearly in Markdown according to the Interviewer Pattern.
2. Prompt "Nick" using `notify_user` with the specific state, what was achieved, and the available edge paths (e.g., "Approve", "Reject", "Retry").
3. Proceed down the corresponding chosen edge based on Nick's explicit response.

## Stage 4: Finalization
**Goal:** Complete the pipeline and summarize the run.
1. Upon reaching a terminal node, verify that goal gates have been satisfied.
2. Clean up any temporary states.
3. Compile a `walkthrough.md` in the brain directory summarizing the completed pipeline, the nodes traversed, and the final state.
4. Update `attractor/runs/<run_id>/outcome.md` with the final definition of done.
