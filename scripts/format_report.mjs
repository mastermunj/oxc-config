import { mkdtempSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const oxfmtBin = resolve('node_modules/.bin/oxfmt');

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    ...options,
  });
}

function extractFlaggedFiles(output) {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.endsWith('ms)'))
    .map((line) => line.replace(/\s*\(\d+ms\)$/, ''))
    .filter(Boolean)
    .filter((file) => !file.startsWith('node_modules/'));
}

const check = run(oxfmtBin, ['--check', '--threads=1', '.']);
if (check.stdout) {
  process.stdout.write(check.stdout);
}
if (check.stderr) {
  process.stderr.write(check.stderr);
}

if (check.status === 0) {
  process.exit(0);
}

const files = extractFlaggedFiles(check.stdout || '');
if (files.length === 0) {
  process.stderr.write('\nNo per-file entries were emitted by oxfmt --check. Falling back to summary output above.\n');
  process.exit(check.status || 1);
}

let diffCount = 0;
let errorCount = 0;

for (const file of files) {
  const originalPath = resolve(file);
  const tempDir = mkdtempSync(join(tmpdir(), 'oxfmt-diff-'));
  const tempPath = join(tempDir, basename(file));

  try {
    copyFileSync(originalPath, tempPath);

    const formatResult = run(oxfmtBin, ['--write', tempPath]);
    if (formatResult.status !== 0) {
      errorCount += 1;
      process.stderr.write(`\n--- Non-fixable formatting error: ${file} ---\n`);
      if (formatResult.stderr) {
        process.stderr.write(formatResult.stderr);
      } else if (formatResult.stdout) {
        process.stderr.write(formatResult.stdout);
      } else {
        process.stderr.write('Unknown formatter error (no output returned).\n');
      }
      continue;
    }

    const before = readFileSync(originalPath, 'utf8');
    const after = readFileSync(tempPath, 'utf8');

    if (before === after) {
      errorCount += 1;
      process.stderr.write(`\n--- Non-fixable formatting error: ${file} ---\n`);
      process.stderr.write('Formatter flagged the file, but no diff was produced after temp formatting.\n');
    } else {
      diffCount += 1;
      const diff = run('diff', ['-u', '--label', `a/${file}`, '--label', `b/${file}`, originalPath, tempPath]);
      process.stdout.write(`\n--- Formatting diff: ${file} ---\n`);
      if (diff.stdout) {
        process.stdout.write(diff.stdout);
      } else {
        process.stdout.write('File differs after formatting, but no unified diff was produced.\n');
      }
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

if (diffCount === 0 && errorCount === 0) {
  process.stdout.write('\nNo file-level diffs could be derived, even though --check failed.\n');
}

process.exit(1);
