/**
 * Accessibility Module - Barrierefreiheit
 * Injects an accessibility button, a modal, and SVG filters for color blindness.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'cloaki_a11y_mode';
  const MODES = [
    { id: 'normal', name: 'Standard (Kein Filter)', icon: 'visibility' },
    { id: 'protanopia', name: 'Protanopie (Rot-Schwäche)', icon: 'palette' },
    { id: 'deuteranopia', name: 'Deuteranopie (Grün-Schwäche)', icon: 'palette' },
    { id: 'tritanopia', name: 'Tritanopia (Blau-Schwäche)', icon: 'palette' },
    { id: 'grayscale', name: 'Graustufen (Monochrom)', icon: 'contrast' },
    { id: 'contrast', name: 'Hoher Kontrast', icon: 'brightness_6' }
  ];
  const ZOOM_KEY = 'cloaki_a11y_zoom';

  // 1. (SVG Filter werden nun direkt ins HTML injiziert, um FOUC zu vermeiden)
  function injectFilters() {
    // wird nicht mehr benötigt, Filter sind im HTML
  }

  // 2. Initiale Einstellung laden und anwenden
  function loadAndApplyMode() {
    const mode = localStorage.getItem(STORAGE_KEY) || 'normal';
    applyMode(mode);
  }

  function applyMode(modeId) {
    // Alte Klassen entfernen
    MODES.forEach(m => document.documentElement.classList.remove('a11y-mode-' + m.id));
    if (modeId !== 'normal') {
      document.documentElement.classList.add('a11y-mode-' + modeId);
    }
  }

  function applyZoom(zoomVal) {
    const scale = zoomVal / 100;
    document.body.style.zoom = scale;
    // Inverse zoom for loader to prevent logo shifting
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.zoom = 1 / scale;
  }

  // Sofort anwenden um FOUC der Farben zu vermeiden
  loadAndApplyMode();
  applyZoom(localStorage.getItem(ZOOM_KEY) || 100);

  // 3. UI Injektion (erst wenn DOM ready)
  function initUI() {
    injectFilters();

    // Button
    const btn = document.createElement('div');
    btn.id = 'a11y-btn';
    btn.setAttribute('aria-label', 'Barrierefreiheit & Farben');
    btn.innerHTML = `
      <md-icon-button>
        <md-icon>accessibility_new</md-icon>
      </md-icon-button>
    `;
    document.body.appendChild(btn);

    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-a11y';
    
    let optionsHtml = '';
    const currentMode = localStorage.getItem(STORAGE_KEY) || 'normal';
    
    MODES.forEach(mode => {
      const isSelected = mode.id === currentMode;
      optionsHtml += `
        <div class="a11y-option" data-mode="${mode.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--button-bg); border: 1px solid ${isSelected ? 'var(--md-sys-color-primary)' : 'var(--button-border)'}; border-radius: var(--md-sys-shape-corner-medium); margin-bottom: 8px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <md-icon style="color: var(--md-sys-color-primary)">${mode.icon}</md-icon>
            <span>${mode.name}</span>
          </div>
          <md-icon class="a11y-check" style="opacity: ${isSelected ? '1' : '0'}; color: var(--md-sys-color-primary)">check_circle</md-icon>
        </div>
      `;
    });

    modal.innerHTML = `
      <div class="modal-content">
        <div class="close-modal" onclick="document.getElementById('modal-a11y').classList.remove('active')">
          <md-icon-button>
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>
        <h2><md-icon>visibility</md-icon> Barrierefreiheit & Farbfilter</h2>
        <p>Wähle einen Modus, um die Darstellung der Website an deine Bedürfnisse (z. B. Farbblindheit) anzupassen.</p>
        <div style="margin-top: 24px;">
          ${optionsHtml}
        </div>
        
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--card-border);">
          <h3 style="margin-top: 0; font-size: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Google Sans', sans-serif;">
            <md-icon>zoom_in</md-icon> Website-Größe anpassen
          </h3>
          <p style="font-size: 14px; margin-top: 4px; margin-bottom: 16px; color: var(--text-secondary);">Macht Texte und Elemente größer oder kleiner.</p>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span style="font-size: 14px; width: 40px; text-align: right;">100%</span>
            <input type="range" id="a11y-zoom-slider" min="80" max="150" step="10" value="${localStorage.getItem(ZOOM_KEY) || 100}" style="flex: 1; accent-color: var(--md-sys-color-primary); cursor: pointer;">
            <span style="font-size: 14px; width: 45px;" id="a11y-zoom-val">${localStorage.getItem(ZOOM_KEY) || 100}%</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Events
    btn.addEventListener('click', () => {
      document.getElementById('modal-a11y').classList.add('active');
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    const options = document.querySelectorAll('.a11y-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedMode = opt.getAttribute('data-mode');
        localStorage.setItem(STORAGE_KEY, selectedMode);
        applyMode(selectedMode);
        
        // Update UI
        options.forEach(o => {
          o.style.border = '1px solid var(--button-border)';
          o.querySelector('.a11y-check').style.opacity = '0';
        });
        opt.style.border = '1px solid var(--md-sys-color-primary)';
        opt.querySelector('.a11y-check').style.opacity = '1';
      });

      // Hover effects
      opt.addEventListener('mouseenter', () => {
        if (localStorage.getItem(STORAGE_KEY) !== opt.getAttribute('data-mode')) {
          opt.style.background = 'var(--button-hover-bg)';
        }
      });
      opt.addEventListener('mouseleave', () => {
        opt.style.background = 'var(--button-bg)';
      });
    });

    const zoomSlider = document.getElementById('a11y-zoom-slider');
    const zoomVal = document.getElementById('a11y-zoom-val');
    
    zoomSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      zoomVal.textContent = val + '%';
      applyZoom(val);
      localStorage.setItem(ZOOM_KEY, val);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})();
