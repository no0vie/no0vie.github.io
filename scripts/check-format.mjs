import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const trackedFiles = spawnSync('git', ['ls-files', '-z'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});

if (trackedFiles.status !== 0) process.exit(trackedFiles.status ?? 1);

const files = trackedFiles.stdout.split('\0').filter((file) => file && existsSync(file));
const prettier = process.platform === 'win32' ? 'prettier.cmd' : 'prettier';
const result = spawnSync(prettier, ['--check', '--ignore-unknown', ...files], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
