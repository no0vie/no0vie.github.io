import { chmodSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

if (!process.env.CI) {
  const config = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (config.status !== 0) {
    const reason = config.stderr.trim() || 'not inside a Git worktree';
    console.warn(`Git hooks were not configured: ${reason}`);
  } else {
    if (process.platform !== 'win32') chmodSync('.githooks/pre-push', 0o755);
    console.log('Configured Git hooks from .githooks.');
  }
}
