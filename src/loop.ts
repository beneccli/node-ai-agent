import fs from "fs";
import path from "path";
import simpleGit from 'simple-git';
import { LLMClient } from './llm';
import { LLMStub } from './llmStub';
import { createPlan, Step } from './planner';
import { applyEdit } from './editor';
import { runTests } from './tester';
import chalk from 'chalk';

export interface RunOptions {
  repoPath: string;
  branch: string;
  task: string;
  maxIterations?: number;
  llm?: LLMClient;
}

/**
 * Run the agent loop on the given repository.
 */
export async function runAgent(options: RunOptions): Promise<void> {
  const { repoPath, branch, task } = options;
  const maxIterations = options.maxIterations ?? 5;
  const llm = options.llm ?? new LLMStub();
  const git = simpleGit(repoPath);
  await git.checkout(branch);
  const plan = await createPlan(task, llm);

  for (let i = 0; i < Math.min(plan.length, maxIterations); i++) {
    const step = plan[i];
    if (step.type === 'edit') {
      await applyEdit(repoPath, step);
    } else if (step.type === 'test') {
      const ok = await runTests(repoPath);
      if (ok) break;
    }
  }

  const diff = await git.diff(['--color=always', 'HEAD']);
  await fs.promises.mkdir(path.join(repoPath, 'out'), { recursive: true });
  await fs.promises.writeFile(path.join(repoPath, 'out/diff.txt'), diff);
  console.log(chalk.green('\nDiff\n')); 
  console.log(diff);
}
