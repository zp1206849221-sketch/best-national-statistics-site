// Hand-in program for the Japan National Statistics entry (Node 22, standard library only).
// The site itself is the static app/ folder beside this file: plain HTML, CSS and ES modules
// that load nothing over the network. This program copies app/ and screenshots/ into the
// output directory and writes dossier.json there with the vendored make.fun library.
// vendor/makefun-frontend.ts is left exactly as shipped: the scorer requires dossier.json
// to be byte for byte what its own copy of buildDossier writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, mirrored from the starter so an oversized entry fails here first:
// at most 4 screenshots of at most 256 KiB each, at most 993 files and 16 MiB in app/.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log(`handed in: app/ and screenshots/ copied to ${out}, dossier.json ${dossier.length} bytes`);
