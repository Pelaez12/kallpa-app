/**
 * Kallpa & Búnker Cross - Mobile SPA Logic
 * Dynamic tab switching, plan selection, pre-filled WhatsApp message generation,
 * and high-resolution Lightbox viewer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const msgInput = document.getElementById('custom-msg-input');
  const optionCards = document.querySelectorAll('.option-card');

  // Default selected plan per category
  let activeTab = 'natacion';
  let selectedPlan = '';

  // Standard pre-filled message templates
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
      return `¡Hola! Quisiera más información sobre las Clases de Natación (Piscina Temperada Colegio Fanning).${planDetail} Por favor brindar detalles de horarios y vacantes disponibles.`;
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
      optionCards.forEach(card => card.classList.remove('selected'));

      // Update WhatsApp Message Textarea
      updateMessage();
    });
  });

  // Option Card click handler
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      // Unselect siblings
      const currentPanel = card.closest('.tab-panel');
      if (currentPanel) {
        currentPanel.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
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
