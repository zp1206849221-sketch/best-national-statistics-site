// Japan in Numbers: the program that hands the entry in.
//
// What is being handed in: the static site under app/ (plain HTML, CSS and
// ES modules; it loads nothing over the network), the captures under
// screenshots/, and one machine-written description of both, dossier.json.
// That description has to match, byte for byte, what the platform's own
// library produces from the same folders — so this program does the
// carrying and leaves the describing to vendor/makefun-frontend.ts, which
// is imported untouched below.
//
// The steps, in order:
//   1. work out where this file lives and where the output goes — outside
//      the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//          mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//   2. copy app/ across, then screenshots/ across, counting both as they go;
//   3. call buildDossier on the copies and save the JSON it returns.
//
// Node 22, standard library only, no build step and nothing to install.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where the entry sits, and where the hand-in is assembled.
const ENTRY_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The platform's caps, named once here and passed to buildDossier in full.
// The grader holds the entry to these same numbers; passing them means an
// oversized entry fails in this run, with this program's name on the error,
// instead of failing silently later.
const TEXT_BUDGET_BYTES = 163840; // the dossier's text section, at most
const SHOT_COUNT_LIMIT = 4; // screenshots per entry
const SHOT_SIZE_LIMIT = 262144; // 256 KiB for any one screenshot
const APP_FILE_LIMIT = 993; // files and directories under app/
const APP_SIZE_LIMIT = 16777216; // 16 MiB of files under app/

/** One line of progress, tagged so it stands out in the grader's log. */
function say(message: string): void {
  console.log(`[hand-in] ${message}`);
}

/** What a copied folder tree came to: how many files, and their total size. */
interface CarriedTree {
  files: number;
  bytes: number;
}

/**
 * Copy the folder at `sourceDir` into `targetDir`, making sub-folders as
 * they are met, and report what was carried. The walk is written out by
 * hand rather than delegated to cpSync so that the counts in the log come
 * from the very same traversal that moved the bytes — if a file is ever
 * skipped, the numbers will say so.
 */
function mirrorTree(sourceDir: string, targetDir: string): CarriedTree {
  mkdirSync(targetDir, { recursive: true });
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(sourceDir)) {
    const from = join(sourceDir, name);
    const to = join(targetDir, name);
    const info = statSync(from);
    if (info.isDirectory()) {
      const inner = mirrorTree(from, to);
      files += inner.files;
      bytes += inner.bytes;
    } else {
      copyFileSync(from, to);
      files += 1;
      bytes += info.size;
    }
  }
  return { files, bytes };
}

/**
 * Walk a folder tree the same way mirrorTree does, but move nothing: the
 * counts are an independent measurement, used to check a copy against the
 * tree it was copied from.
 */
function measureTree(rootDir: string): CarriedTree {
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(rootDir)) {
    const info = statSync(join(rootDir, name));
    if (info.isDirectory()) {
      const inner = measureTree(join(rootDir, name));
      files += inner.files;
      bytes += inner.bytes;
    } else {
      files += 1;
      bytes += info.size;
    }
  }
  return { files, bytes };
}

/**
 * Copy `sourceDir` into `targetDir` and then prove the copy is complete:
 * the source measured before, the copy counted as it was made, and the
 * result measured again afterwards must all three agree. A disagreement
 * means the hand-in would describe a different site from the one in this
 * repository, so it stops the run rather than logging a polite warning.
 */
function copyAndVerify(sourceDir: string, targetDir: string, label: string): CarriedTree {
  const expected = measureTree(sourceDir);
  const carried = mirrorTree(sourceDir, targetDir);
  const actual = measureTree(targetDir);
  const agrees = (a: CarriedTree, b: CarriedTree) => a.files === b.files && a.bytes === b.bytes;
  if (!agrees(carried, expected) || !agrees(actual, expected)) {
    throw new Error(
      `${label}: copy does not match its source ` +
        `(source ${expected.files} files/${expected.bytes} bytes, ` +
        `carried ${carried.files}/${carried.bytes}, ` +
        `on disk ${actual.files}/${actual.bytes})`,
    );
  }
  say(`${label}: ${carried.files} files, ${carried.bytes} bytes copied and verified`);
  return carried;
}

// ------------------------------------------------------------------ hand-in

const appSource = join(ENTRY_DIR, 'app');
if (!existsSync(join(appSource, 'index.html'))) {
  // Fail before anything is copied: a folder without its page is not a site.
  throw new Error(`no site to hand in: ${join(appSource, 'index.html')} is missing`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

copyAndVerify(appSource, join(OUTPUT_DIR, 'app'), 'app/');

const shotsSource = join(ENTRY_DIR, 'screenshots');
mkdirSync(join(OUTPUT_DIR, 'screenshots'), { recursive: true });
if (existsSync(shotsSource)) {
  copyAndVerify(shotsSource, join(OUTPUT_DIR, 'screenshots'), 'screenshots/');
} else {
  say('screenshots/: no folder beside main.ts, so none are handed in');
}

const dossier = buildDossier(OUTPUT_DIR, {
  text_max_bytes: TEXT_BUDGET_BYTES,
  screenshots: { max: SHOT_COUNT_LIMIT, max_bytes: SHOT_SIZE_LIMIT },
  app_max_files: APP_FILE_LIMIT,
  app_max_bytes: APP_SIZE_LIMIT,
});
writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
say(`dossier.json: written, ${dossier.length} bytes`);
say(`done: the entry is assembled in ${OUTPUT_DIR}`);
