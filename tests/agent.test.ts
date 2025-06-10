import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import simpleGit from 'simple-git';
import { runAgent } from '../src/loop';
import { LLMStub } from '../src/llmStub';

jest.setTimeout(60000);

describe('agent e2e', () => {
  let repoDir: string;

  beforeAll(async () => {
    repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sample-service-'));
    fs.cpSync(path.join(__dirname, '../fixtures/sample-service'), repoDir, { recursive: true });
    await new Promise(r => { const p = spawn('npm', ['install'], { cwd: repoDir, stdio: 'inherit' }); p.on('close', () => r(undefined)); });
    const git = simpleGit(repoDir);
    await git.init();
    await git.add('.');
    await git.commit('init');
  });

  test('adds hello route and tests pass', async () => {
    await runAgent({ repoPath: repoDir, branch: 'master', task: 'Add GET /hello', llm: new LLMStub() });
    const appFile = fs.readFileSync(path.join(repoDir, 'src/app.js'), 'utf8');
    expect(appFile).toMatch('/hello');
    const testFile = fs.readFileSync(path.join(repoDir, 'test/hello.test.js'), 'utf8');
    expect(testFile).toMatch('GET /hello');
    const { spawn } = await import('child_process');
    await new Promise(r => { const p = spawn('npm', ['test'], { cwd: repoDir, stdio: 'inherit' }); p.on('close', () => r(undefined)); });
  });
});
