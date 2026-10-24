import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const publicFiles = [
  'index.html', 'styles.css', 'app.js', 'pwa.js', 'sw.js',
  'manifest.webmanifest', 'robots.txt', 'sitemap.xml', 'sitemap.html',
  'google782eddfc18437c54.html'
];
export function collectPublicFiles() {
  const files = [...publicFiles];
  for (const directory of ['assets', 'assets/icons']) {
    for (const entry of readdirSync(resolve(projectRoot, directory), { withFileTypes: true })) {
      if (entry.isFile() && !entry.name.startsWith('.') && /\.(png|jpe?g|webp|svg)$/i.test(entry.name)) {
        const path = `${directory}/${entry.name}`;
        const size = statSync(resolve(projectRoot, path)).size;
        if (size) files.push(path); // Original empty flyers are not used by the app.
      }
    }
  }
  for (const file of files) {
    if (statSync(resolve(projectRoot, file)).size > 25 * 1024 * 1024) {
      throw new Error(`El archivo público supera 25 MiB: ${file}`);
    }
  }
  return files;
}
export function buildStatic() {
  const files = collectPublicFiles();
  const output = resolve(projectRoot, 'dist');
  // Only this dedicated generated folder may be replaced, never the repository.
  if (relative(projectRoot, output) !== 'dist' || (existsSync(output) && lstatSync(output).isSymbolicLink())) {
    throw new Error('La carpeta de salida no es segura.');
  }
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  for (const file of files) {
    const target = resolve(output, file);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(resolve(projectRoot, file), target);
  }
  return { output, files };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files } = buildStatic();
  console.log(`Web preparada en dist/: ${files.length} archivos públicos, sin dependencias ni secretos.`);
}
