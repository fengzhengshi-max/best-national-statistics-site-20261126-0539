// NationScope entrypoint (Node 22, standard library only).
// The program hands the site in: it copies app/ and screenshots/ from beside
// this file into the output directory and writes /output/dossier.json — the
// summary the judge reads — using the vendored make.fun library, which must
// stay exactly as the kit shipped it. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: two runs write byte-identical output.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree only when it exists, so a missing screenshots folder
// is an empty folder rather than a crash.
function copyIfPresent(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) return;
  cpSync(from, join(outputDir, name), { recursive: true });
}

mkdirSync(outputDir, { recursive: true });

// Fail loudly, before copying anything, when the site shell is missing.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing; nothing to hand in');
}
copyIfPresent('app');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
copyIfPresent('screenshots');

// Guard the dossier's own limits before building it: no more than 4
// screenshots, none over 256 KiB — the same caps the scorer enforces.
const shots = readdirSync(join(outputDir, 'screenshots'));
if (shots.length > 4) throw new Error('too many screenshots: ' + shots.length);

writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
