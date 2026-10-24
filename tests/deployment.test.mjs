import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { buildStatic, collectPublicFiles, projectRoot } from '../scripts/build-static.mjs';

test('root asset upload excludes dependencies, secrets and server code', () => {
  const temp = mkdtempSync(join(tmpdir(), 'kallpa-assets-'));
  try {
    execFileSync('git', ['init', '--quiet', temp]);
    writeFileSync(join(temp, '.gitignore'), readFileSync(resolve(projectRoot, '.assetsignore')));
    const forbidden = [
      'node_modules/workerd/bin/workerd', 'node_modules/wrangler/wrangler.js',
      '.env', '.env.example', '.git/config', '.local/subscriptions.json',
      'server.mjs', 'package.json', 'package-lock.json', 'README.md',
      'tests/server.test.mjs', 'scripts/notify.mjs', 'test-results/profile/file',
      'dist/index.html', 'future-private-file.txt', 'assets/.env', 'assets/icons/.env'
    ];
    const allowed = collectPublicFiles();
    const result = spawnSync('git', ['-c', 'core.excludesFile=', 'check-ignore', '--no-index', '--stdin'], {
      cwd: temp, input: [...forbidden, ...allowed].join('\n') + '\n', encoding: 'utf8'
    });
    assert.equal(result.status, 0, result.stderr);
    const ignored = new Set(result.stdout.trim().split(/\r?\n/));
    for (const path of forbidden) assert(ignored.has(path), `Must exclude ${path}`);
    for (const path of allowed) assert(!ignored.has(path), `Must publish ${path}`);
  } finally {
    // temp is created by mkdtemp under the OS temporary directory.
    assert(temp.startsWith(resolve(tmpdir()) + (process.platform === 'win32' ? '\\' : '/')));
    rmSync(temp, { recursive: true, force: true });
  }
});

test('build output contains the complete PWA and only public files', () => {
  const { output, files } = buildStatic();
  function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
      entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
  }
  assert.equal(walk(output).length, files.length);
  for (const path of files) {
    assert.deepEqual(readFileSync(join(output, path)), readFileSync(join(projectRoot, path)));
    assert(statSync(join(output, path)).size <= 25 * 1024 * 1024);
  }
  const shell = readFileSync(join(output, 'sw.js'), 'utf8').split('].map(path')[0];
  for (const [, path] of shell.matchAll(/'\.\/([^']+)'/g)) {
    assert(files.includes(path), `Missing offline asset ${path}`);
  }
  const manifest = JSON.parse(readFileSync(join(output, 'manifest.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) assert(files.includes(icon.src));
});
