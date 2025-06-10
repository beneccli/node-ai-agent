# node-ai-agent

A local code-mod agent prototype written in TypeScript.

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
node dist/cli.js --repo <path> --branch <name> --task "Add GET /hello"
```

## Architecture

The agent plans steps with a stubbed LLM, edits code, runs tests, and iterates until tests pass or five attempts are reached. See `src/` for implementation.

To swap in a real model, replace `llmStub` with your own `LLMClient` implementation.

## Specification

The agent is designed to follow these phases on each run:

1. **Input** – accept a plain text task along with a Git repo path and branch.
2. **Plan / Think** – break the task into concrete steps (files to touch, tests to write, commands to run).
3. **Edit** – modify code in place or create new files using simple‑git or shell commands.
4. **Test loop** – for each attempt: generate/adjust tests, run `npm test`, fix failures. Stop after `MAX_ITERATIONS` (default `5`).
5. **Output** – summarise the changes and show the unified diff.
6. **Safety** – enforce timeouts and kill any runaway child processes.

### Project layout

```
/src
  cli.ts      // CLI entry
  planner.ts  // converts task -> plan steps
  llm.ts      // interface for LLM
  llmStub.ts  // canned responses / interactive mode
  editor.ts   // applies edits
  tester.ts   // runs jest / mocha
  loop.ts     // orchestration state-machine
/tests        // self tests for the agent
/fixtures     // sample service and stub responses
```

Implementation tips include representing each plan step as:

```ts
interface Step {
  type: 'edit' | 'shell' | 'test';
  description: string;
  payload: any;
}
```

Diffs are written to `out/diff.txt` using `git diff --color=always HEAD` and every shell command is run with a timeout of `180_000` ms.

### Testing without an AI

1. **Unit tests** – mock `LLMClient.complete()` with deterministic fixtures.
2. **E2E smoke test** – run the agent on the bundled sample repo and ensure tests pass in under 30s.
3. **Manual mode** – passing `--interactive` makes the stub prompt for each LLM response.

### Codex‑2025 system prompt (excerpt)

```
You are an autonomous local code-mod agent running entirely in Node.js.
Given a repo path, branch, and task you will:
1. Form a plan.
2. Execute the plan until `npm test` passes or MAX_ITERATIONS is reached.
3. Leave the repo modified but uncommitted and print a summary + diff.
4. Enforce MAX_ITERATIONS=5 and a per-iteration timeout of 3 min.
5. Use the injectable `LLMClient` interface (see llmStub.ts for the stub).
```
