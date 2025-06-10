import { spawn } from 'child_process';

/** Run npm test in the given repository. */
export async function runTests(repoPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn('npm', ['test'], { cwd: repoPath, stdio: 'inherit' });
    const timer = setTimeout(() => proc.kill('SIGTERM'), 180000);
    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });
  });
}
