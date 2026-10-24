// Administrative command. Credentials stay in the server environment.
const [title, body, link = '/#promociones'] = process.argv.slice(2);
if (!title || !body || !process.env.PUSH_ADMIN_TOKEN) {
  console.error('Uso: npm run notify -- "Título" "Mensaje" "/#muay-thai". Requiere PUSH_ADMIN_TOKEN.');
  process.exitCode = 1;
} else {
  const response = await fetch(new URL('/api/push/send', process.env.PUBLIC_ORIGIN || 'http://localhost:4173'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PUSH_ADMIN_TOKEN}` },
    body: JSON.stringify({ title, body, url: link })
  });
  if (!response.ok) { console.error(`No se pudo enviar: HTTP ${response.status}`); process.exitCode = 1; }
  else console.log(await response.json());
}
