import { cpSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';
const sourceRoot = fileURLToPath(new URL('.', import.meta.url));
const artifactRoot = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
function publishStaticDirectory(name: string) {
  const from = join(sourceRoot, name);
  const to = join(artifactRoot, name);
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}
function verifyScreenshots() {
  const names = readdirSync(join(sourceRoot, 'screenshots')).filter(n => !n.startsWith('.'));
  if (names.length < 3 || names.length > 4) throw new Error('Wakekeeper requires three or four genuine playtest screenshots.');
  for (const name of names) {
    const image = readFileSync(join(sourceRoot, 'screenshots', name));
    if (image.byteLength > 262144) throw new Error(`Screenshot exceeds the competition cap: ${name}`);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.(jpg|jpeg|png)$/i.test(name)) throw new Error(`Unsupported screenshot name: ${name}`);
  }
}
verifyScreenshots();
publishStaticDirectory('game');
publishStaticDirectory('screenshots');
const dossierBytes = buildDossier(artifactRoot, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, game_max_files: 993, game_max_bytes: 50331648, game_path_max_bytes: 1000 });
writeFileSync(join(artifactRoot, 'dossier.json'), dossierBytes);
