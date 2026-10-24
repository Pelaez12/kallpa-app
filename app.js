/**
 * Kallpa & Búnker Cross - Mobile SPA Logic
 * Dynamic tab switching, plan selection, pre-filled WhatsApp message generation,
 * high-resolution Lightbox viewer, and dynamic promotional flyer rendering.
 */

const PROMO_FLYERS_DATA = {
  muayThai: {
    id: 'muayThai',
    brand: 'Kallpa & Búnker Cross',
    themeClass: 'muay-thai-theme',
    category: 'MUAY THAI PARA MUJERES',
    title: 'Muay Thai para mujeres',
    image: 'assets/muay-thai-mujeres.png',
    description: 'Una hora para enfocarte en ti. Anímate a practicar un deporte de contacto que puede ayudarte a controlar tus emociones. 😊',
    priceOptions: [
      { label: '8 CLASES', price: 'S/ 160', featured: false },
      { label: '12 CLASES', price: 'S/ 250', featured: true, badge: 'PROMO' }
    ],
    schedule: ['Martes y jueves: 7:00 p. m. a 8:00 p. m.'],
    note: 'Consulta por WhatsApp la sede, las vacantes y la vigencia de los paquetes.',
    ctaText: 'Consultar clases',
    ctaSubtext: 'Muay Thai para mujeres'
  },
  bunkerNatacion: {
    id: 'bunkerNatacion',
    brand: 'Búnker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'NATACIÓN PERSONALIZADA',
    title: 'CLASES DE NATACIÓN',
    image: null,
    description: 'Entrenamiento individual 1 a 1 en Piscina Temperada El Fanning',
    priceOptions: [
      { label: '1 CLASE (1 HORA)', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X4 CLASES', price: 'S/ 240', featured: true, badge: 'AHORRA S/ 40' }
    ],
    schedule: [
      'Sábados: 2:00 pm',
      'Domingos: 9:00 am'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  bunkerGymBox: {
    id: 'bunkerGymBox',
    brand: 'Búnker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'MUSCULACIÓN (GYMBOX)',
    title: 'ENTRENAMIENTO PERSONALIZADO',
    image: null,
    description: 'Rutina de musculación y mejora física guiada por Coach en GymBox',
    priceOptions: [
      { label: '8 SESIONES', price: 'S/ 200', featured: false },
      { label: '12 SESIONES', price: 'S/ 250', featured: true, badge: 'MEJOR PRECIO' }
    ],
    schedule: [
      'Lunes a Viernes: 9:00 am – 4:00 pm',
      'Sábados: 8:00 am, 9:00 am u 11:00 am'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  bunkerPaddleSurf: {
    id: 'bunkerPaddleSurf',
    brand: 'Búnker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'PADDLE SURF',
    title: 'PADDLE SURF EXPERIENCIA',
    image: null,
    description: 'Aventura en el mar con equipo completo e instructor capacitado',
    priceOptions: [
      { label: '1 SESIÓN', price: 'S/ 110', featured: false },
      { label: 'PAQUETE X4 CLASES', price: 'S/ 360', featured: true, badge: 'AHORRA S/ 80' }
    ],
    includes: [
      'Traslado ida y vuelta',
      'Wetsuit térmico',
      'Tabla + Chaleco',
      'Instructor dedicado'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Consultar fechas y vacantes'
  },
  bunkerOpenBox: {
    id: 'bunkerOpenBox',
    brand: 'Búnker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'GIMNASIO LIBRE',
    title: 'GIMNASIO LIBRE (USO DE INSTALACIONES)',
    image: null,
    description: 'Uso libre de máquinas, instalaciones y equipamiento GymBox Búnker',
    priceOptions: [
      { label: 'MENSUALIDAD', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X2 MESES', price: 'S/ 120', featured: true, badge: 'AHORRA S/ 20' }
    ],
    schedule: [
      'Lunes a Viernes: 9:00 am – 4:00 pm'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  bunkerAtletas: {
    id: 'bunkerAtletas',
    brand: 'GYMBOX BÚNKER',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'ATLETAS JUVENILES',
    title: 'ELITE TRAINING CAMP',
    image: 'assets/promo_atletas_juveniles.jpg',
    description: 'ATHLETIC SANS • Planificación integral para las Promesas del Deporte (Fuerza Funcional, Velocidad Reactiva y Acondicionamiento Metabólico)',
    priceOptions: [
      { label: '1 MES', price: 'S/ 150', featured: false },
      { label: '3 MESES', price: 'S/ 360', featured: false, badge: 'AHORRO' },
      { label: '6 MESES', price: 'S/ 660', featured: true, badge: 'ELITE' }
    ],
    schedule: [
      'Lunes a Jueves: 4:00 PM & 5:00 PM',
      'Lunes: Tren Inferior | Martes: Tren Superior',
      'Miércoles: Velocidad & Potencia | Jueves: Técnica & Trote'
    ],
    includes: [
      'Activation Warm up',
      'Core Stability',
      'Strength & Technique',
      'Metcon (W.O.D)'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Inscripciones abiertas por WhatsApp'
  },
  kallpaNatacion: {
    id: 'kallpaNatacion',
    brand: 'Kallpa Natación',
    accentColor: '#25b7e0',
    themeClass: 'kallpa-flyer-theme',
    category: 'KALLPA NATACIÓN',
    title: 'CLASES DE NATACIÓN',
    image: null,
    description: 'Formación técnica y entrenamiento personalizado de natación',
    priceOptions: [
      { label: '1 CLASE (1 HORA)', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X4 CLASES', price: 'S/ 240', featured: true, badge: 'AHORRA S/ 40' }
    ],
    schedule: [
      'Sábados: 2:00 pm',
      'Domingos: 9:00 am'
    ],
    ctaText: 'CONSULTAR VACANTES',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  triatlon: {
    id: 'triatlon',
    brand: 'Kallpa Triatlón',
    accentColor: '#e53e3e',
    themeClass: 'triatlon-flyer-theme',
    category: 'TRIATLÓN',
    title: 'NADAR + CICLISMO + RUNNING',
    image: 'assets/flyer_triatlon.jpg',
    description: 'Únete a nuestros entrenamientos para tu próxima Triatlón y cruza la meta con una guía planificada y en equipo.',
    priceOptions: [
      { label: 'PLAN MENSUAL', price: 'S/ 330', featured: false },
      { label: 'PLAN TRIMESTRAL', price: 'S/ 890', featured: true, badge: 'AHORRO' }
    ],
    schedule: [
      'Natación en Piscina (entre semana)',
      'Sábados: Acuatlón',
      'Domingos: Fondos Ciclismo y/o Running'
    ],
    includes: [
      'Club Registrado',
      'Entrenador Certificado',
      'Plan de Entrenamiento a distancia',
      '3 días de entrenamiento grupal',
      'Acceso a GymBox BÚNKER'
    ],
    ctaText: 'ÚNETE AL CLUB',
    ctaSubtext: 'Inscripciones abiertas por WhatsApp'
  }
};

/**
 * Render HTML string for a Promotional Flyer Card
 * @param {Object} data Flyer data dataset
 * @returns {string} HTML markup
 */
function renderPromoFlyer(data) {
  if (!data) return '';

  const imageHtml = data.image ? `
    <div class="image-viewer-wrapper">
      <img src="${data.image}" alt="${data.title}" class="promo-image" loading="lazy" decoding="async">
      <button class="zoom-trigger-btn" onclick="openLightbox('${data.image}', '${data.brand} - ${data.title}')">
        <i class="fa-solid fa-expand"></i> Ver afiche completo
      </button>
    </div>
  ` : '';

  const priceOptionsHtml = data.priceOptions.map((opt) => `
    <div class="flyer-price-card option-card ${opt.featured ? 'featured' : ''}" data-plan="${data.brand} - ${data.category} (${opt.label} x ${opt.price})">
      ${opt.badge ? `<span class="flyer-badge">${opt.badge}</span>` : ''}
      <span class="flyer-price-label">${opt.label}</span>
      <span class="flyer-price-val">${opt.price}</span>
    </div>
  `).join('');

  const scheduleHtml = data.schedule ? `
    <div class="flyer-schedule-box">
      <strong><i class="fa-regular fa-clock"></i> Horarios:</strong>
      <ul>
        ${data.schedule.map(s => `<li>• ${s}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const includesHtml = data.includes ? `
    <div class="flyer-includes-box">
      <strong><i class="fa-solid fa-circle-check"></i> Incluye:</strong>
      <ul class="flyer-includes-list">
        ${data.includes.map(inc => `<li><i class="fa-solid fa-check"></i> ${inc}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
    <div class="promo-flyer-card ${data.themeClass}" data-flyer="${data.id}">
      ${imageHtml}
      <div class="flyer-body">
        <span class="flyer-brand-tag">${data.brand} • ${data.category}</span>
        <h3 class="flyer-title">${data.title}</h3>
        <p class="flyer-subtitle">${data.description}</p>
        
        <div class="flyer-price-options">
          ${priceOptionsHtml}
        </div>

        ${scheduleHtml}
        ${includesHtml}
        ${data.note ? `<p class="flyer-subtitle">${data.note}</p>` : ''}
      </div>

      <button class="flyer-cta-bar" data-reserve-flyer="${data.id}">
        <span class="flyer-cta-text">${data.ctaText}</span>
        <span class="flyer-cta-sub">${data.ctaSubtext} <i class="fa-solid fa-arrow-right"></i></span>
      </button>
    </div>
  `;
}

/**
 * Populate flyer mount containers with dynamic promo flyer cards
 */
function mountFlyers() {
  const mounts = {
    'mount-muay-thai': 'muayThai',
    'mount-bunker-natacion': 'bunkerNatacion',
    'mount-bunker-gymbox': 'bunkerGymBox',
    'mount-bunker-atletas': 'bunkerAtletas',
    'mount-triatlon': 'triatlon',
    'mount-paddle-surf': 'bunkerPaddleSurf',
    'mount-openbox': 'bunkerOpenBox'
  };

  for (const [elemId, key] of Object.entries(mounts)) {
    const container = document.getElementById(elemId);
    if (container && PROMO_FLYERS_DATA[key]) {
      container.innerHTML = renderPromoFlyer(PROMO_FLYERS_DATA[key]);
    }
  }

  const promoGrid = document.getElementById('mount-promociones-grid');
  if (promoGrid) {
    promoGrid.innerHTML = Object.values(PROMO_FLYERS_DATA)
      .map(data => renderPromoFlyer(data))
      .join('');
  }
  document.getElementById('catalog-count').textContent = `TODOS (${Object.keys(PROMO_FLYERS_DATA).length})`;
}

// Keep a separate draft for each program, including the user's edits.
document.addEventListener('DOMContentLoaded', () => {
  mountFlyers();
  const navBtns = [...document.querySelectorAll('.nav-btn')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  const msgInput = document.getElementById('custom-msg-input');
  const status = document.getElementById('plan-status');
  const drafts = new Map();
  let activeTab = '';
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stateFor = key => {
    if (!drafts.has(key)) drafts.set(key, { plan: '', message: '' });
    return drafts.get(key);
  };
  function makeMessage(plan) {
    const panel = document.getElementById(`panel-${activeTab}`);
    const subject = plan || panel.dataset.category;
    return `¡Hola! Me interesa ${subject}. Quisiera consultar los horarios, la sede y las vacantes disponibles para inscribirme.`;
  }
  function updateMessage() {
    const state = stateFor(activeTab);
    if (!state.message) state.message = makeMessage(state.plan);
    msgInput.value = state.message;
    status.textContent = state.plan ? `Plan elegido: ${state.plan}` : 'Elige un plan o consulta por el programa completo.';
  }
  navBtns.forEach((btn, index) => {
    const key = btn.dataset.tab;
    btn.id = `tab-${key}`;
    btn.tabIndex = index ? -1 : 0;
    const panel = document.getElementById(`panel-${key}`);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', btn.id);
    panel.tabIndex = 0;
    btn.addEventListener('click', () => {
      if (location.hash === `#${key}`) activate(key, true);
      else location.hash = key;
    });
    btn.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % navBtns.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + navBtns.length) % navBtns.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = navBtns.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      navBtns[next].focus();
      navBtns[next].click();
    });
  });
  function activate(key, scroll = false) {
    if (!navBtns.some(btn => btn.dataset.tab === key)) key = 'natacion';
    if (activeTab) stateFor(activeTab).message = msgInput.value;
    activeTab = key;
    navBtns.forEach(btn => {
      const active = btn.dataset.tab === key;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.id === `panel-${key}`;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    updateMessage();
    if (scroll && document.activeElement?.getAttribute('role') !== 'tab') {
      document.getElementById(`panel-${key}`).scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
    }
  }
  // A hash is compared as data, never interpolated into a CSS selector.
  window.addEventListener('hashchange', () => {
    const key = location.hash.slice(1);
    if (navBtns.some(btn => btn.dataset.tab === key)) activate(key, true);
    else if (!key) activate('natacion');
  });
  document.querySelectorAll('.option-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.tabIndex = 0;
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });
  function choosePlan(card) {
    const panel = card.closest('.tab-panel');
    panel.querySelectorAll('.option-card').forEach(item => {
      item.classList.toggle('selected', item === card);
      item.setAttribute('aria-pressed', String(item === card));
    });
    const state = stateFor(activeTab);
    state.plan = card.dataset.plan;
    state.message = makeMessage(state.plan);
    updateMessage();
  }
  document.addEventListener('click', event => {
    const card = event.target.closest('.option-card');
    if (card) choosePlan(card);
    const cta = event.target.closest('[data-reserve-flyer]');
    if (!cta) return;
    const flyer = cta.closest('[data-flyer]');
    const selected = flyer.querySelector('.option-card.selected');
    const data = PROMO_FLYERS_DATA[cta.dataset.reserveFlyer];
    // The clicked flyer's context takes precedence over any other catalog card.
    const plan = selected?.dataset.plan || `${data.brand} - ${data.category}`;
    const state = stateFor(activeTab);
    if (state.plan !== plan) {
      if (!selected) {
        cta.closest('.tab-panel').querySelectorAll('.option-card').forEach(card => {
          card.classList.remove('selected');
          card.setAttribute('aria-pressed', 'false');
        });
      }
      state.plan = plan;
      state.message = makeMessage(plan);
      updateMessage();
    }
    openWhatsApp('955882306');
  });
  msgInput.addEventListener('input', () => { stateFor(activeTab).message = msgInput.value; });
  document.querySelectorAll('img').forEach(img => {
    img.decoding = 'async';
    img.addEventListener('error', () => {
      const viewer = img.closest('.image-viewer-wrapper');
      if (viewer) viewer.hidden = true;
    });
  });
  activate(location.hash.slice(1));
});

function openWhatsApp(phone) {
  const input = document.getElementById('custom-msg-input');
  const message = input?.value.trim() || '¡Hola! Quisiera más información sobre los programas de Kallpa & Búnker Cross.';
  const digits = String(phone).replace(/\D/g, '');
  const number = digits.length === 9 ? `51${digits}` : digits;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}
function selectNumberAndReserve(phone) { openWhatsApp(phone); }

let lightboxOpener;
let savedBodyOverflow = '';
function openLightbox(imageSrc, captionText) {
  const modal = document.getElementById('lightbox-modal');
  const image = document.getElementById('lightbox-img');
  lightboxOpener = document.activeElement;
  savedBodyOverflow = document.body.style.overflow;
  image.src = imageSrc;
  image.alt = captionText || 'Afiche promocional';
  document.getElementById('lightbox-caption').textContent = captionText || 'Afiche promocional';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.querySelector('.app-viewport').inert = true;
  document.body.style.overflow = 'hidden';
  modal.querySelector('button').focus();
}
function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal.classList.contains('active')) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelector('.app-viewport').inert = false;
  document.body.style.overflow = savedBodyOverflow;
  lightboxOpener?.focus();
}
document.addEventListener('keydown', event => {
  if (!document.getElementById('lightbox-modal').classList.contains('active')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'Tab') {
    event.preventDefault();
    document.querySelector('.lightbox-close').focus();
  }
});
