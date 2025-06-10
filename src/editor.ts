import fs from 'fs';
import path from 'path';
import { Step } from './planner';

/** Apply an edit step to the repository. */
export async function applyEdit(repoPath: string, step: Step): Promise<void> {
  if (step.type !== 'edit') return;
  const payload = step.payload || {};
  const file = path.join(repoPath, payload.file);
  if (payload.content !== undefined) {
    await fs.promises.mkdir(path.dirname(file), { recursive: true });
    await fs.promises.writeFile(file, payload.content);
  } else if (payload.append !== undefined) {
    await fs.promises.appendFile(file, payload.append);
  }
}
