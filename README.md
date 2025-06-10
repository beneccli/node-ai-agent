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
