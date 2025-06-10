import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { LLMClient } from './llm';

/**
 * Stubbed LLM that reads deterministic responses from fixtures/responses.json
 * or falls back to interactive stdin.
 */
export class LLMStub implements LLMClient {
  private responses: Record<string, any> = {};

  constructor() {
    const file = path.join(__dirname, '../fixtures/responses.json');
    if (fs.existsSync(file)) {
      this.responses = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  }

  async complete(prompt: string): Promise<string> {
    if (this.responses[prompt]) {
      const data = this.responses[prompt];
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>((resolve) => {
      rl.question(prompt + '\n> ', (ans) => resolve(ans));
    });
    rl.close();
    return answer;
  }
}
