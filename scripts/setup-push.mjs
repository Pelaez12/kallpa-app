import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import webpush from 'web-push';

if (existsSync('.env')) {
  console.error('Ya existe .env. Se conserva la configuración actual.');
  process.exitCode = 1;
} else {
  const keys = webpush.generateVAPIDKeys();
  const content = [
    'PUBLIC_ORIGIN=http://localhost:4173',
    'VAPID_SUBJECT=https://info.comunidadfortaleza.com/',
    `VAPID_PUBLIC_KEY=${keys.publicKey}`,
    `VAPID_PRIVATE_KEY=${keys.privateKey}`,
    `PUSH_ADMIN_TOKEN=${randomBytes(32).toString('hex')}`,
    'PUSH_DATA_DIR=.local',
    'PORT=4173',
    'HOST=127.0.0.1',
    ''
  ].join('\n');
  writeFileSync('.env', content, { mode: 0o600, flag: 'wx' });
  console.log('Configuración local creada en .env. Las claves privadas no se muestran ni se suben a Git.');
}
