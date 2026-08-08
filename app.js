/**
 * Kallpa & Búnker Cross - Mobile SPA Logic
 * Dynamic tab switching, plan selection, pre-filled WhatsApp message generation,
 * high-resolution Lightbox viewer, and dynamic promotional flyer rendering.
 */

// Dataset containing all 5 promotional flyers
const PROMO_FLYERS_DATA = {
  bunkerNatacion: {
    id: 'bunkerNatacion',
    brand: 'Bünker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'NATACIÓN PERSONALIZADA',
    title: 'CLASES DE NATACIÓN',
    description: 'Entrenamiento individual 1 a 1 en Piscina Temperada El Fanning',
    priceOptions: [
      { label: '1 CLASE (1 HORA)', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X4 CLASES', price: 'S/ 240', featured: true, badge: 'AHORRA S/ 40' }
    ],
    schedule: [
      'Sábados: 2:00 pm',
      'Domingos: 9:00 am'
    ],
    ctaText: 'RESERVAR AHORA',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  bunkerGymBox: {
    id: 'bunkerGymBox',
    brand: 'Bünker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'MUSCULACIÓN (GYMBOX)',
    title: 'ENTRENAMIENTO PERSONALIZADO',
    description: 'Rutina de musculación y mejora física guiada por Coach en GymBox',
    priceOptions: [
      { label: '8 SESIONES', price: 'S/ 200', featured: false },
      { label: '12 SESIONES', price: 'S/ 250', featured: true, badge: 'MEJOR PRECIO' }
    ],
    schedule: [
      'Lunes a Viernes: 9:00 am – 4:00 pm',
      'Sábados: 8:00 am, 9:00 am u 11:00 am'
    ],
    ctaText: 'RESERVAR AHORA',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  bunkerPaddleSurf: {
    id: 'bunkerPaddleSurf',
    brand: 'Bünker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'PADDLE SURF',
    title: 'PADDLE SURF EXPERIENCIA',
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
    ctaText: 'RESERVAR AHORA',
    ctaSubtext: 'Consultar fechas y vacantes'
  },
  bunkerOpenBox: {
    id: 'bunkerOpenBox',
    brand: 'Bünker Cross',
    accentColor: '#ff5a1f',
    themeClass: 'bunker-flyer-theme',
    category: 'OPENBOX',
    title: 'OPENBOX ENTRENAMIENTO LIBRE',
    description: 'Uso libre de instalaciones y equipamiento GymBox Búnker',
    priceOptions: [
      { label: 'MENSUALIDAD', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X2 MESES', price: 'S/ 120', featured: true, badge: 'AHORRA S/ 20' }
    ],
    schedule: [
      'Lunes a Viernes: 9:00 am – 4:00 pm'
    ],
    ctaText: 'RESERVAR AHORA',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  },
  kallpaNatacion: {
    id: 'kallpaNatacion',
    brand: 'Kallpa Natación',
    accentColor: '#25b7e0',
    themeClass: 'kallpa-flyer-theme',
    category: 'KALLPA NATACIÓN',
    title: 'CLASES DE NATACIÓN',
    description: 'Formación técnica y entrenamiento personalizado de natación',
    priceOptions: [
      { label: '1 CLASE (1 HORA)', price: 'S/ 70', featured: false },
      { label: 'PAQUETE X4 CLASES', price: 'S/ 240', featured: true, badge: 'AHORRA S/ 40' }
    ],
    schedule: [
      'Sábados: 2:00 pm',
      'Domingos: 9:00 am'
    ],
    ctaText: 'RESERVAR AHORA',
    ctaSubtext: 'Atención inmediata por WhatsApp'
  }
};

/**
 * Render HTML string for a Promotional Flyer Card
 * @param {Object} data Flyer data dataset
 * @returns {string} HTML markup
 */
function renderPromoFlyer(data) {
  if (!data) return '';

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
    <div class="promo-flyer-card ${data.themeClass}" id="flyer-${data.id}">
      <div class="flyer-body">
        <span class="flyer-brand-tag">${data.brand} • ${data.category}</span>
        <h3 class="flyer-title">${data.title}</h3>
        <p class="flyer-subtitle">${data.description}</p>
        
        <div class="flyer-price-options">
          ${priceOptionsHtml}
        </div>

        ${scheduleHtml}
        ${includesHtml}
      </div>

      <button class="flyer-cta-bar" onclick="openWhatsApp('955882306')">
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
    'mount-bunker-natacion': 'bunkerNatacion',
    'mount-bunker-gymbox': 'bunkerGymBox',
    'mount-kallpa-natacion': 'kallpaNatacion',
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
}

document.addEventListener('DOMContentLoaded', () => {
  // Populate flyer mount containers
  mountFlyers();

  // DOM Elements
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const msgInput = document.getElementById('custom-msg-input');

  // Default selected plan per category
  let activeTab = 'natacion';
  let selectedPlan = '';

  // Standard pre-filled message templates per window / tab
  const messageTemplates = {
    natacion: (plan) => {
      const planDetail = plan ? ` Interés en el plan: [${plan}].` : '';
      return `¡Hola! Me interesa la Promoción Especial de Natación Integral (3 Meses).${planDetail} Quisiera más información y reservar mi cupo.`;
    },
    bunker: (plan) => {
      const planDetail = plan ? ` Interés en el plan: [${plan}].` : '';
      return `¡Hola! Deseo información y reservar una membresía para Búnker Cross Gimnasio / Funcional en Jesús María.${planDetail}`;
    },
    kallpa: (plan) => {
      const planDetail = plan ? ` Interés en: [${plan}].` : '';
      return `¡Hola! Quisiera más información sobre las Clases Grupales de Natación (Piscina Temperada Colegio Fanning).${planDetail} Por favor brindar detalles de horarios y vacantes disponibles.`;
    },
    'natacion-pers': (plan) => {
      const planDetail = plan ? ` Interés en el paquete: [${plan}].` : '';
      return `¡Hola! Quisiera información y reservar mi horario para Natación Personalizada (Clases 1 a 1 en Piscina Fanning).${planDetail} Por favor brindar vacantes para agendar.`;
    },
    'gimnasio-pers': (plan) => {
      const planDetail = plan ? ` Interés en: [${plan}].` : '';
      return `¡Hola! Deseo información y agendar mi plan de Entrenamiento Personalizado de Musculación y Mejora Física en el GymBox BÜNKER CROSS.${planDetail}`;
    },
    'paddle-openbox': (plan) => {
      const planDetail = plan ? ` Interés en: [${plan}].` : '';
      return `¡Hola! Deseo información sobre los servicios de Paddle Surf y OpenBox.${planDetail} Por favor brindar vacantes y detalles.`;
    },
    promociones: (plan) => {
      const planDetail = plan ? ` Interés en: [${plan}].` : '';
      return `¡Hola! Quisiera información y reservar la promoción: ${planDetail || '[Consultar Promociones]'}. Por favor brindar detalles.`;
    },
    contacto: () => {
      return `¡Hola! Quisiera realizar una consulta general sobre las Clases de Natación y Gimnasio Búnker Cross en Jesús María.`;
    }
  };

  // Function to update pre-filled message
  function updateMessage() {
    if (messageTemplates[activeTab]) {
      msgInput.value = messageTemplates[activeTab](selectedPlan);
    }
  }

  // Tab switching handler
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      activeTab = targetTab;
      selectedPlan = ''; // reset plan selection when switching tabs

      // Update Nav Buttons
      navBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update Tab Panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        }
      });

      // Clear card selections in all panels
      document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));

      // Update WhatsApp Message Textarea
      updateMessage();
    });
  });

  // Option Card click handler via Event Delegation (handles static and dynamically rendered cards)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;

    // Unselect siblings in current option container or panel
    const currentContainer = card.closest('.flyer-price-options') || card.closest('.tab-panel');
    if (currentContainer) {
      currentContainer.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    }

    card.classList.add('selected');
    selectedPlan = card.getAttribute('data-plan') || '';
    updateMessage();

    // Soft scroll to reservation section
    const resBox = document.querySelector('.reservation-box');
    if (resBox) {
      resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Initial Message Setup
  updateMessage();
});

/**
 * Open WhatsApp with specified number & current textarea message
 * @param {string} phone 
 */
function openWhatsApp(phone) {
  const msgInput = document.getElementById('custom-msg-input');
  const messageText = msgInput ? msgInput.value.trim() : '¡Hola! Quisiera más información.';
  const encodedMsg = encodeURIComponent(messageText);
  
  // Format clean phone number
  const cleanPhone = phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/51${cleanPhone}?text=${encodedMsg}`;
  
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Helper to select a specific phone number and trigger WhatsApp
 * @param {string} phone 
 */
function selectNumberAndReserve(phone) {
  openWhatsApp(phone);
}

/**
 * Lightbox Modal Logic for Image Fullscreen Viewing
 */
function openLightbox(imageSrc, captionText) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (modal && img) {
    img.src = imageSrc;
    if (caption) caption.textContent = captionText || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

