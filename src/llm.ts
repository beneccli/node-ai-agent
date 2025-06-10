/** LLM client interface used by the agent. */
export interface LLMClient {
  /**
   * Complete the given prompt and return a string response.
   * @param prompt Prompt text
   */
  complete(prompt: string, opts?: Record<string, unknown>): Promise<string>;
}
