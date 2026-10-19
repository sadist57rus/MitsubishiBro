import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const assetsDir = 'dist/assets';
const entry = readdirSync(assetsDir).find((name) => /^index-.*\.js$/.test(name));
if (!entry) throw new Error('Could not find the Vite main entry bundle in dist/assets');

const source = readFileSync(`${assetsDir}/${entry}`);
const gzipBytes = gzipSync(source, { level: 9 }).byteLength;
const limitBytes = 300 * 1024;
console.log(`[bundle-budget] ${entry}: ${(source.byteLength / 1024).toFixed(2)} KiB raw; ${(gzipBytes / 1024).toFixed(2)} KiB gzip; limit 300.00 KiB gzip`);
if (gzipBytes > limitBytes) {
  throw new Error(`Main bundle exceeds 300 KiB gzip budget: ${(gzipBytes / 1024).toFixed(2)} KiB`);
}
