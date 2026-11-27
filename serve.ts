// serve.ts — a tiny static server for local testing only (Node 22, stdlib).
// Serves app/ at http://localhost:8080 so the site can be opened in a browser
// without a build step. Usage: `node serve.ts` or `node serve.ts --port 9000`.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(fileURLToPath(new URL('./app', import.meta.url)));

function mimeFor(file) {
  switch (extname(file).toLowerCase()) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': case '.mjs': return 'text/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

function portFromArgs() {
  const i = process.argv.indexOf('--port');
  const n = i === -1 ? NaN : Number(process.argv[i + 1]);
  return Number.isInteger(n) && n > 0 && n < 65536 ? n : 8080;
}

createServer((req, res) => {
  let path = '/';
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = resolve(join(appDir, normalize(path)));
  if (file !== appDir && !file.startsWith(appDir + sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let size;
  try {
    const st = statSync(file);
    if (!st.isFile()) throw new Error('not a file');
    size = st.size;
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': mimeFor(file), 'content-length': size, 'cache-control': 'no-store' });
  createReadStream(file).pipe(res);
}).listen(portFromArgs(), '127.0.0.1', () => {
  console.log('NationScope app/ is on http://localhost:' + portFromArgs());
});
