import { runAgent } from './loop';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: any = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--repo') opts.repoPath = args[++i];
    else if (arg === '--branch') opts.branch = args[++i];
    else if (arg === '--task') opts.task = args[++i];
  }
  if (!opts.repoPath || !opts.branch || !opts.task) {
    console.error('Usage: node dist/cli.js --repo <path> --branch <name> --task "<task>"');
    process.exit(1);
  }
  return opts;
}

(async () => {
  const opts = parseArgs();
  await runAgent(opts);
})();
