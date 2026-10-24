# Kallpa App

Proyecto independiente de Touche Hair Studio. Web informativa de Kallpa & Búnker
Cross, con programas, precios, horarios y consultas por WhatsApp. Conserva la
identidad visual existente.

## Ejecutar localmente

Node.js 22 o superior:

```sh
npm ci
npm run setup:push
npm start
```

Abrir http://localhost:4173. `setup:push` genera las claves VAPID y un token
administrativo en `.env`, sin imprimir secretos. No sobrescribe una configuración
existente. Las claves se generan una sola vez y deben conservarse.

## PWA e instalación

- Manifest con iconos de 192 y 512 px, icono adaptable y modo `standalone`.
- Botón de instalación y aviso discreto cuando Chrome/Edge emite
  `beforeinstallprompt`. El diálogo final es el nativo del navegador.
- En navegadores sin ese evento se muestran instrucciones desde el botón.
- Cache de la aplicación y los afiches para consulta sin conexión. La interfaz
  avisa que los precios guardados requieren confirmación al reconectarse.
- Las actualizaciones del service worker se aplican con el botón “Actualizar
  app”. Cambiar `CACHE` en `sw.js` al publicar una nueva versión.

Chrome decide si ofrece el diálogo. No se puede forzar su aparición automática
ni presentarlo como una notificación enviada por Google. Instalar y autorizar
notificaciones son permisos diferentes. La PWA requiere HTTPS, salvo localhost.

## Notificaciones reales de promociones

El servidor Node incluye:

- `GET /api/push/config`: disponibilidad y clave VAPID pública.
- `POST /api/push/subscribe`: alta/actualización de una suscripción voluntaria.
- `POST /api/push/unsubscribe`: baja del dispositivo.
- `POST /api/push/send`: envío administrativo con `Authorization: Bearer TOKEN`.

El visitante activa el permiso desde un botón; no se solicita al cargar la web.
Los avisos se muestran mediante el service worker y abren el programa indicado.
No se envían promociones automáticamente ni se importan contactos de WhatsApp.

Para enviar una campaña desde una máquina administrativa con las variables de
entorno configuradas:

```sh
npm run notify -- "Muay Thai para mujeres" "8 clases por S/ 160 o 12 por S/ 250 (promo). Martes y jueves, de 7 a 8 p. m." "/#muay-thai"
```

La respuesta devuelve `sent` (aceptadas por el proveedor), `removed` (suscripciones
vencidas) y `failed`. Aceptada por el proveedor no garantiza que el sistema
operativo muestre el aviso inmediatamente.

## Publicar

### Cloudflare Workers: archivos públicos

El despliegue existente usa la raíz del repositorio como directorio de assets.
`.gitignore` excluye dependencias de Git, pero no determina qué publica Wrangler.
Por eso se incluye `.assetsignore`: permite únicamente HTML, CSS, JavaScript de
la web, el manifest y las imágenes. Excluye `node_modules`, configuración,
servidor, pruebas, documentación y secretos, incluso al desplegar `--assets .`.

Este archivo corrige el error `Asset too large` al intentar subir el ejecutable
`node_modules/workerd/bin/workerd` instalado durante el build de Cloudflare.
No se necesita cambiar el comando del dashboard para aplicar esta exclusión.

También hay una salida dedicada para configuraciones que prefieran no publicar
desde la raíz:

```sh
npm run build
```

Genera `dist/` con los archivos públicos de la PWA. En Cloudflare se puede usar
`npm run build` como comando de build y `./dist` como directorio de assets del
comando de despliegue existente. `dist/` no contiene dependencias ni el backend.

Referencia: [exclusión de assets en Cloudflare](https://developers.cloudflare.com/workers/static-assets/binding/#ignoring-assets).

### Servicio de notificaciones

La PWA informativa puede publicarse como archivos estáticos. Para notificaciones
push hay que desplegar **también** `server.mjs` en un hosting Node con HTTPS, o
redirigir `/api/push/*` desde el dominio de la web a ese servicio.

1. Configurar `PUBLIC_ORIGIN` con el origen público exacto, sin barra final.
2. Configurar las claves VAPID y `PUSH_ADMIN_TOKEN` en los secretos del hosting.
   No incluir `.env` en el despliegue estático ni en Git.
3. Configurar `PUSH_DATA_DIR` en un volumen persistente, fuera de los archivos
   públicos. Conservar este volumen y las claves al actualizar.
4. Ejecutar una única instancia Node, detrás de un proxy HTTPS. Ajustar `HOST`
   a `0.0.0.0` solo si el hosting lo necesita. No usar almacenamiento efímero ni
   varias instancias con este almacén de suscripciones en archivo.
5. Servir `sw.js`, HTML y manifest con revalidación, sin cache inmutable. No
   redirigir rutas de API a `index.html`.
6. Probar desde un dispositivo real: instalar, activar avisos, enviar una campaña
   de prueba a ese dispositivo, abrir el aviso y desactivar la suscripción.

El servidor limita el tamaño y frecuencia de solicitudes, valida destinos push,
mantiene los datos privados fuera de las rutas públicas y elimina suscripciones
vencidas. Admite hasta 5.000 dispositivos. Para crecer, sustituir el almacén en
archivo por un servicio persistente compartido.

En iPhone/iPad, las notificaciones web requieren una versión compatible del
sistema y abrir la app instalada desde la pantalla de inicio. La entrega depende
del permiso del usuario, el navegador, el sistema operativo y la conectividad.

## Validación

`npm test` verifica autorización administrativa, rechazo de orígenes ajenos,
validación de destinos, persistencia, bajas, eliminación de suscripciones
vencidas y protección de archivos privados, usando un proveedor de envío simulado.

Pruebas de navegador:

```sh
npx playwright install chromium
npm start
# En otra terminal:
npm run test:browser
```

Para usar Edge instalado en Windows, configurar `PLAYWRIGHT_CHANNEL=msedge`.
Las pruebas recorren los 11 programas en anchos de 320, 390, 768 y 1440 px;
comprueban WhatsApp, teclado, foco del visor, borradores, enlaces, historial,
funcionamiento sin conexión y manifest. Los permisos de notificación y el
evento de instalación se simulan para verificar la interfaz sin enviar avisos.
Las capturas se guardan en `test-results/`, excluido de Git.

El código está preparado localmente. Este cambio no publica automáticamente el
sitio, no activa un hosting y no envía avisos a visitantes reales.

Referencias: [instalación PWA](https://web.dev/learn/pwa/installation-prompt),
[Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API),
[Web Push para Node](https://github.com/web-push-libs/web-push).
