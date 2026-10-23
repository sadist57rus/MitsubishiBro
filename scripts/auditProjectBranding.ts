import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage', '.gradle', 'build']);
const textExtensions = new Set([
  '.md', '.ts', '.tsx', '.js', '.jsx', '.json', '.webmanifest', '.html',
  '.xml', '.yml', '.yaml', '.css', '.gradle', '.properties', '.svg',
  '.java', '.kt', '.sh', '.txt', '.toml'
]);
const legacyTerms = [
  ['Mitsubishi', 'Bro'].join(''),
  ['Mitsubishi-', 'Bro'].join(''),
  ['Car', 'Brother'].join(' '),
  ['Car-', 'Brother'].join(''),
  ['Nippon', 'Drive'].join(' ')
];
const errors: string[] = [];

function walk(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }
    if (!entry.isFile()) continue;
    const extension = entry.name.includes('.') ? entry.name.slice(entry.name.lastIndexOf('.')) : '';
    if (!textExtensions.has(extension.toLowerCase())) continue;
    if (relative(root, absolutePath) === 'scripts/auditProjectBranding.ts') continue;

    let content: string;
    try {
      content = readFileSync(absolutePath, 'utf8');
    } catch {
      continue;
    }
    content.split(/\r?\n/).forEach((line, index) => {
      // These historical keys/prefixes are intentionally retained to migrate existing user data
      // and delete old offline caches. They are not current branding.
      const searchableLine = line
        .replace(/car-brother-[a-z0-9-]+/gi, '')
        .replace(/mitsubishi-bro-offline-/gi, '');
      for (const term of legacyTerms) {
        if (searchableLine.toLowerCase().includes(term.toLowerCase())) {
          errors.push(`${relative(root, absolutePath)}:${index + 1}: legacy project name "${term}"`);
          break;
        }
      }
    });
  }
}

walk(root);
if (errors.length) {
  console.error('Найдены остатки старых названий проекта:');
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else {
  console.log('Branding audit passed: no legacy branding remains outside compatibility identifiers.');
}
