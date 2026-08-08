# Promotional Flyers Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate 5 dynamic reusable promotional flyer cards into `kallpa-app` matching exact user flyer design references and dataset specifications, adding a dedicated `Paddle Surf & OpenBox` tab and full responsive `Promociones` grid view.

**Architecture:** A modular JavaScript component function `renderPromoFlyer(data)` will render HTML templates for each flyer based on structured data objects. Pure CSS design tokens will enforce Búnker Cross (`#0e1117` + `#ff5a1f`) and Kallpa Natación (`#04192e` + `#25b7e0`) visual themes with 'Anton' and 'Inter' Google Fonts.

**Tech Stack:** HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+), Python `http.server` for local verification.

---

### Task 1: Add Google Fonts and Flyer Styles in `styles.css`

**Files:**
- Modify: `C:\Users\USER\Documents\antigravity\wonderful-pasteur\kallpa-app\styles.css`

- [ ] **Step 1: Add Google Fonts import for 'Anton' and 'Inter' at the top of `styles.css`**

Add the import line at the top of `styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap');
```

- [ ] **Step 2: Add CSS Flyer classes and themes in `styles.css`**

Add the following flyer classes to `styles.css`:
```css
/* ==========================================================================
   PROMOTIONAL FLYER CARDS DESIGN SYSTEM
   ========================================================================== */

.flyers-responsive-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

@media (max-width: 768px) {
  .flyers-responsive-grid {
    grid-template-columns: 1fr;
  }
}

.promo-flyer-card {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-glass);
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.promo-flyer-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.8);
}

/* Theme: Búnker Cross (Dark Concrete + Orange) */
.promo-flyer-card.bunker-flyer-theme {
  background: 
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.015),
      rgba(255, 255, 255, 0.015) 2px,
      transparent 2px,
      transparent 8px
    ),
    #0e1117;
  border-color: rgba(255, 90, 31, 0.35);
}

/* Theme: Kallpa Natación (Navy + Aqua) */
.promo-flyer-card.kallpa-flyer-theme {
  background: 
    repeating-linear-gradient(
      -45deg,
      rgba(37, 183, 224, 0.03),
      rgba(37, 183, 224, 0.03) 2px,
      transparent 2px,
      transparent 8px
    ),
    #04192e;
  border-color: rgba(37, 183, 224, 0.35);
}

.flyer-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.flyer-brand-tag {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
  width: fit-content;
}

.bunker-flyer-theme .flyer-brand-tag {
  background: rgba(255, 90, 31, 0.18);
  color: #ff5a1f;
  border: 1px solid #ff5a1f;
}

.kallpa-flyer-theme .flyer-brand-tag {
  background: rgba(37, 183, 224, 0.18);
  color: #25b7e0;
  border: 1px solid #25b7e0;
}

.flyer-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.65rem;
  line-height: 1.1;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-transform: uppercase;
}

.flyer-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.35;
}

.flyer-price-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 480px) {
  .flyer-price-options {
    grid-template-columns: 1fr;
  }
}

.flyer-price-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flyer-price-card:hover, .flyer-price-card.selected {
  transform: translateY(-2px);
}

.bunker-flyer-theme .flyer-price-card:hover,
.bunker-flyer-theme .flyer-price-card.selected {
  border-color: #ff5a1f;
  box-shadow: 0 0 12px rgba(255, 90, 31, 0.35);
  background: rgba(255, 90, 31, 0.12);
}

.kallpa-flyer-theme .flyer-price-card:hover,
.kallpa-flyer-theme .flyer-price-card.selected {
  border-color: #25b7e0;
  box-shadow: 0 0 12px rgba(37, 183, 224, 0.35);
  background: rgba(37, 183, 224, 0.12);
}

.flyer-price-card.featured {
  border-width: 2px;
}

.bunker-flyer-theme .flyer-price-card.featured {
  border-color: #ff5a1f;
}

.kallpa-flyer-theme .flyer-price-card.featured {
  border-color: #25b7e0;
}

.flyer-badge {
  position: absolute;
  top: -10px;
  right: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.62rem;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.bunker-flyer-theme .flyer-badge {
  background: #ff5a1f;
  color: #0e1117;
}

.kallpa-flyer-theme .flyer-badge {
  background: #25b7e0;
  color: #04192e;
}

.flyer-price-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.flyer-price-val {
  font-family: 'Anton', sans-serif;
  font-size: 1.6rem;
  color: #ffffff;
}

.flyer-schedule-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flyer-schedule-box strong {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  color: #ffffff;
}

.flyer-schedule-box ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--text-secondary);
}

.flyer-includes-box {
  background: rgba(0, 0, 0, 0.35);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.flyer-includes-box strong {
  font-size: 0.78rem;
  font-weight: 800;
  color: #ffffff;
  display: block;
  margin-bottom: 4px;
}

.flyer-includes-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.flyer-includes-list li i {
  margin-right: 4px;
}

.bunker-flyer-theme .flyer-includes-list li i { color: #ff5a1f; }
.kallpa-flyer-theme .flyer-includes-list li i { color: #25b7e0; }

.flyer-cta-bar {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border: none;
  font-family: 'Inter', sans-serif;
}

.bunker-flyer-theme .flyer-cta-bar {
  background: #ff5a1f;
  color: #0e1117;
}

.kallpa-flyer-theme .flyer-cta-bar {
  background: #25b7e0;
  color: #04192e;
}

.flyer-cta-bar:hover {
  opacity: 0.92;
}

.flyer-cta-text {
  font-family: 'Anton', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.flyer-cta-sub {
  font-size: 0.72rem;
  font-weight: 700;
  opacity: 0.9;
}
```

- [ ] **Step 3: Commit CSS changes**

```bash
git add styles.css
git commit -m "style: add promotional flyer design system tokens and themes"
```

---

### Task 2: Implement Flyer Renderer & Data Objects in `app.js`

**Files:**
- Modify: `C:\Users\USER\Documents\antigravity\wonderful-pasteur\kallpa-app\app.js`

- [ ] **Step 1: Define `PROMO_FLYERS_DATA` dictionary in `app.js`**

Add the dataset to `app.js`:
```javascript
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
    description: 'Uso libre de instalaciones y equipamiento GymBox Bünker',
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
```

- [ ] **Step 2: Add `renderPromoFlyer(data)` function and DOM mount logic**

Add `renderPromoFlyer` in `app.js`:
```javascript
function renderPromoFlyer(data) {
  const priceOptionsHtml = data.priceOptions.map((opt, idx) => `
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
```

- [ ] **Step 3: Update `messageTemplates` for Paddle Surf, OpenBox, and Promociones in `app.js`**

Update `messageTemplates`:
```javascript
'paddle-openbox': (plan) => {
  const planDetail = plan ? ` Interés en: [${plan}].` : '';
  return `¡Hola! Deseo información sobre los servicios de Paddle Surf y OpenBox.${planDetail} Por favor brindar vacantes y detalles.`;
},
promociones: (plan) => {
  const planDetail = plan ? ` Interés en: [${plan}].` : '';
  return `¡Hola! Quisiera información y reservar la promoción: ${planDetail || '[Consultar Promociones]'}. Por favor brindar detalles.`;
}
```

- [ ] **Step 4: Commit `app.js` changes**

```bash
git add app.js
git commit -m "feat: implement renderPromoFlyer renderer and flyer dataset"
```

---

### Task 3: Update `index.html` Navigation Tabs & Panel Mounts

**Files:**
- Modify: `C:\Users\USER\Documents\antigravity\wonderful-pasteur\kallpa-app\index.html`

- [ ] **Step 1: Add new Tab Buttons in `nav-menu` inside `index.html`**

Update `nav-menu`:
```html
<nav class="nav-menu grid-menu-6" role="tablist" aria-label="Programas y Promociones">
  <button class="nav-btn active" data-tab="natacion" role="tab" aria-selected="true" aria-controls="panel-natacion">
    <span class="btn-icon">🏊‍♂️</span>
    <span class="btn-text">Natación Integral</span>
    <span class="btn-badge">PROMO 3M</span>
  </button>
  <button class="nav-btn" data-tab="bunker" role="tab" aria-selected="false" aria-controls="panel-bunker">
    <span class="btn-icon">🏋️‍♂️</span>
    <span class="btn-text">Gimnasio Búnker</span>
    <span class="btn-badge">GRUPAL</span>
  </button>
  <button class="nav-btn" data-tab="kallpa" role="tab" aria-selected="false" aria-controls="panel-kallpa">
    <span class="btn-icon">🏊‍♀️</span>
    <span class="btn-text">Clases Natación</span>
    <span class="btn-badge">KALLPA</span>
  </button>
  <button class="nav-btn highlight-cyan" data-tab="natacion-pers" role="tab" aria-selected="false" aria-controls="panel-natacion-pers">
    <span class="btn-icon">🎯</span>
    <span class="btn-text">Natación Personalizada</span>
    <span class="btn-badge cyan">1 a 1</span>
  </button>
  <button class="nav-btn highlight-orange" data-tab="gimnasio-pers" role="tab" aria-selected="false" aria-controls="panel-gimnasio-pers">
    <span class="btn-icon">⚡</span>
    <span class="btn-text">Gimnasio Personalizado</span>
    <span class="btn-badge orange">GYMBOX</span>
  </button>
  <button class="nav-btn" data-tab="paddle-openbox" role="tab" aria-selected="false" aria-controls="panel-paddle-openbox">
    <span class="btn-icon">🏄‍♂️</span>
    <span class="btn-text">Paddle Surf & OpenBox</span>
    <span class="btn-badge">NUEVO</span>
  </button>
  <button class="nav-btn" data-tab="promociones" role="tab" aria-selected="false" aria-controls="panel-promociones">
    <span class="btn-icon">🔥</span>
    <span class="btn-text">Catálogo Promociones</span>
    <span class="btn-badge">TODOS (5)</span>
  </button>
  <button class="nav-btn" data-tab="contacto" role="tab" aria-selected="false" aria-controls="panel-contacto">
    <span class="btn-icon">📍</span>
    <span class="btn-text">Horarios y Sedes</span>
    <span class="btn-badge">INFO</span>
  </button>
</nav>
```

- [ ] **Step 2: Embed flyer container mount elements in tab panels inside `index.html`**

In `#panel-natacion-pers`, `#panel-gimnasio-pers`, `#panel-kallpa`, `#panel-paddle-openbox`, and `#panel-promociones`, mount the flyer renderer containers.

- [ ] **Step 3: Commit `index.html` changes**

```bash
git add index.html
git commit -m "feat: add Paddle Surf & OpenBox and Catálogo Promociones tabs to index.html"
```

---

### Task 4: Local Server Verification & GitHub Push to `main`

**Files:**
- Local server: `http://localhost:8080`
- Git remote: `https://github.com/Pelaez12/kallpa-app.git` (main)

- [ ] **Step 1: Test http://127.0.0.1:8080 response**

Fetch `http://127.0.0.1:8080/index.html` to confirm status 200 OK.

- [ ] **Step 2: Push changes to GitHub `main` branch**

```bash
git push origin main
```
