import { readdirSync, readFileSync, statSync } from 'node:fs';
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
    let content: string;
    try {
      content = readFileSync(absolutePath, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      // Legacy localStorage keys are retained for backward-compatible data migration.
      if (/car-brother-[a-z0-9-]+/i.test(line) && /localStorage|readStored|removeStored|appKeys|VERSION_KEY|storage-schema/i.test(line)) {
        const withoutLegacyKeys = line.replace(/car-brother-[a-z0-9-]+/gi, '');
        if (!legacyTerms.some((term) => withoutLegacyKeys.toLowerCase().includes(term.toLowerCase()))) return;
      }
      for (const term of legacyTerms) {
        if (line.toLowerCase().includes(term.toLowerCase())) {
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
  console.log('Branding audit passed: legacy project names were not found in text files.');
}
