import { LLMClient } from './llm';

export interface Step {
  type: 'edit' | 'test';
  description: string;
  payload?: any;
}

/**
 * Create a list of steps for a task using the provided LLM client.
 */
export async function createPlan(task: string, llm: LLMClient): Promise<Step[]> {
  const res = await llm.complete(`PLAN:${task}`);
  return JSON.parse(res) as Step[];
}
