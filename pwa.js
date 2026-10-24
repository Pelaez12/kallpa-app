(() => {
  const byId = id => document.getElementById(id);
  const installButton = byId('install-app');
  const banner = byId('install-banner');
  const pushButton = byId('enable-notifications');
  const stopButton = byId('disable-notifications');
  const status = byId('pwa-status');
  let deferredPrompt;
  let registration;
  let pushConfig;
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const updateConnection = () => { byId('offline-status').hidden = navigator.onLine; };
  updateConnection();
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  function hideInstall() {
    banner.hidden = true;
    installButton.hidden = true;
  }
  if (standalone()) hideInstall();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (standalone()) return;
    installButton.hidden = false;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('kallpa-install-dismissed') === 'yes'; } catch { /* Storage is optional. */ }
    banner.hidden = dismissed;
  });
  async function install() {
    if (!deferredPrompt) {
      status.textContent = /iPad|iPhone|iPod/.test(navigator.userAgent)
        ? 'En Safari, abre Compartir y elige “Agregar a inicio”.'
        : 'Abre el menú de tu navegador y busca “Instalar Kallpa” o “Agregar a la pantalla principal”. La opción aparece cuando el navegador permite la instalación.';
      return;
    }
    const prompt = deferredPrompt;
    deferredPrompt = null;
    banner.hidden = true;
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      status.textContent = result.outcome === 'accepted' ? 'Instalación solicitada. Confirma los pasos del navegador.' : 'Puedes instalar Kallpa cuando quieras desde este botón.';
    } catch { status.textContent = 'No se pudo abrir la instalación. Usa el menú del navegador.'; }
  }
  installButton.addEventListener('click', install);
  byId('banner-install').addEventListener('click', install);
  byId('dismiss-install').addEventListener('click', () => {
    banner.hidden = true;
    try { sessionStorage.setItem('kallpa-install-dismissed', 'yes'); } catch { /* Storage is optional. */ }
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstall();
    status.textContent = 'Kallpa ya está instalada.';
  });
  const apiUrl = route => new URL(`./api/push/${route}`, document.baseURI);
  async function api(route, method, body) {
    const response = await fetch(apiUrl(route), {
      method, headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('push-api');
    return response.json();
  }
  function applicationKey(value) {
    const raw = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  }
  async function syncSubscription() {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) await api('subscribe', 'POST', subscription.toJSON());
    pushButton.hidden = !!subscription;
    stopButton.hidden = !subscription;
    byId('notification-status').textContent = subscription
      ? 'Recibirás avisos de nuevas clases y promociones. Puedes desactivarlos aquí.'
      : 'Recibe avisos de clases y promociones, incluso con Kallpa cerrada. Solo si activas el permiso.';
  }
  let configuringPush = false;
  async function configurePush() {
    if (configuringPush) return;
    configuringPush = true;
    try {
      pushConfig = await api('config', 'GET');
      if (!pushConfig.enabled || !pushConfig.publicKey) throw new Error('not-configured');
      await navigator.serviceWorker.ready;
      await syncSubscription();
    } catch {
      byId('notification-status').textContent = navigator.onLine
        ? 'Los avisos de promociones todavía no están disponibles. Puedes consultar las novedades por WhatsApp.'
        : 'Conéctate a internet para gestionar las notificaciones.';
    } finally { configuringPush = false; }
  }
  window.addEventListener('online', () => {
    if (registration && 'PushManager' in window && 'Notification' in window) configurePush();
  });
  pushButton.addEventListener('click', async () => {
    if (!registration || !pushConfig) return;
    pushButton.disabled = true;
    try {
      // Request permission directly from a user click, never on page load.
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        byId('notification-status').textContent = permission === 'denied'
          ? 'Notificaciones bloqueadas. Puedes habilitarlas en los permisos de este sitio en tu navegador.'
          : 'No activaste las notificaciones. Puedes intentarlo cuando quieras.';
        return;
      }
      const subscription = await registration.pushManager.getSubscription() || await registration.pushManager.subscribe({
        userVisibleOnly: true, applicationServerKey: applicationKey(pushConfig.publicKey)
      });
      await api('subscribe', 'POST', subscription.toJSON());
      await syncSubscription();
    } catch {
      byId('notification-status').textContent = 'No pudimos activar los avisos. Revisa tu conexión e inténtalo de nuevo.';
    } finally { pushButton.disabled = false; }
  });
  stopButton.addEventListener('click', async () => {
    stopButton.disabled = true;
    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // Remove the server subscription first, so a failed request can be retried.
        await api('unsubscribe', 'POST', { endpoint: subscription.endpoint });
        if (!await subscription.unsubscribe()) throw new Error('unsubscribe');
      }
      await syncSubscription();
      byId('notification-status').textContent = 'Notificaciones desactivadas para este dispositivo.';
    } catch { byId('notification-status').textContent = 'No pudimos desactivar los avisos. Revisa tu conexión o cambia el permiso en tu navegador.'; }
    finally { stopButton.disabled = false; }
  });
  async function init() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
      byId('notification-status').textContent = 'La instalación y los avisos requieren un navegador compatible y una conexión HTTPS.';
      return;
    }
    try {
      registration = await navigator.serviceWorker.register('./sw.js');
      const showUpdate = () => { byId('update-app').hidden = false; };
      if (registration.waiting) showUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
        });
      });
      byId('update-app').addEventListener('click', () => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      });
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (byId('update-app').hidden || reloading) return;
        reloading = true;
        location.reload();
      });
      if (!('PushManager' in window) || !('Notification' in window)) {
        byId('notification-status').textContent = 'Este navegador no permite avisos aquí. En iPhone, instala Kallpa y ábrela desde la pantalla de inicio.';
        return;
      }
      await configurePush();
    } catch {
      byId('notification-status').textContent = navigator.onLine
        ? 'Los avisos de promociones todavía no están disponibles. Puedes consultar las novedades por WhatsApp.'
        : 'Conéctate a internet para gestionar las notificaciones.';
    }
  }
  init();
})();
