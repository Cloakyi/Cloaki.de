/**
 * Accessibility Module - Barrierefreiheit
 * Injects an accessibility button, a modal, and SVG filters for color blindness.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'cloaki_a11y_mode';
  const ZOOM_KEY = 'cloaki_a11y_zoom';
  const ANIM_KEY = 'cloaki_a11y_no_animations';
  const SIMPLE_KEY = 'cloaki_a11y_simple';

  const MODES = [
    { id: 'normal', name: 'Standard (Kein Filter)', icon: 'visibility' },
    { id: 'protanopia', name: 'Protanopie (Rot-Schwäche)', icon: 'visibility_off' },
    { id: 'deuteranopia', name: 'Deuteranopie (Grün-Schwäche)', icon: 'nature' },
    { id: 'tritanopia', name: 'Tritanopia (Blau-Schwäche)', icon: 'water_drop' },
    { id: 'grayscale', name: 'Graustufen (Monochrom)', icon: 'invert_colors' },
    { id: 'contrast', name: 'Hoher Kontrast', icon: 'brightness_6' }
  ];

  // Initiale Einstellungen laden und anwenden
  function loadAndApplyAll() {
    const mode = localStorage.getItem(STORAGE_KEY) || 'normal';
    applyMode(mode);

    if (localStorage.getItem(ANIM_KEY) === 'true') {
      document.documentElement.classList.add('a11y-reduced-motion');
    } else {
      document.documentElement.classList.remove('a11y-reduced-motion');
    }

    if (localStorage.getItem(SIMPLE_KEY) === 'true') {
      document.documentElement.classList.add('a11y-simple-mode');
    } else {
      document.documentElement.classList.remove('a11y-simple-mode');
    }
  }

  function applyMode(modeId) {
    MODES.forEach(m => document.documentElement.classList.remove('a11y-mode-' + m.id));
    if (modeId !== 'normal') {
      document.documentElement.classList.add('a11y-mode-' + modeId);
    }
  }

  function applyZoom(zoomVal) {
    const scale = zoomVal / 100;
    document.body.style.zoom = scale;
  }

  function getSavedZoom() {
    let z = parseInt(localStorage.getItem(ZOOM_KEY), 10) || 100;
    return z < 100 ? 100 : z;
  }

  // Sofort anwenden um FOUC der Farben zu vermeiden
  loadAndApplyAll();
  applyZoom(getSavedZoom());

  // Modal open/close helpers
  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus the first option for keyboard users
    const firstOption = modal.querySelector('.a11y-option');
    if (firstOption) firstOption.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Return focus to the trigger button
    const btn = document.getElementById('a11y-btn');
    if (btn) btn.focus();
  }

  // Select an a11y mode option
  function selectOption(opt, options) {
    const selectedMode = opt.getAttribute('data-mode');
    localStorage.setItem(STORAGE_KEY, selectedMode);
    applyMode(selectedMode);

    // Update UI: aria-checked and visual state
    options.forEach(o => {
      o.setAttribute('aria-checked', 'false');
      o.querySelector('.a11y-check').style.opacity = '0';
      o.style.border = '1px solid var(--button-border)';
    });
    opt.setAttribute('aria-checked', 'true');
    opt.querySelector('.a11y-check').style.opacity = '1';
    opt.style.border = '1px solid var(--md-sys-color-primary)';
  }

  function toggleSetting(key, element, className) {
    const currentState = localStorage.getItem(key) === 'true';
    const newState = !currentState;
    localStorage.setItem(key, newState);
    
    if (newState) {
      document.documentElement.classList.add(className);
      element.setAttribute('aria-checked', 'true');
      element.querySelector('.a11y-check').style.opacity = '1';
      element.style.border = '1px solid var(--md-sys-color-primary)';
    } else {
      document.documentElement.classList.remove(className);
      element.setAttribute('aria-checked', 'false');
      element.querySelector('.a11y-check').style.opacity = '0';
      element.style.border = '1px solid var(--button-border)';
    }
  }

  // UI Injection (when DOM ready)
  function initUI() {
    // Button (Prepend so it's the first element reachable via Tab)
    const btn = document.createElement('div');
    btn.id = 'a11y-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', 'Barrierefreiheit & Farben');
    btn.innerHTML = `
      <md-icon-button aria-hidden="true" tabindex="-1">
        <md-icon aria-hidden="true">accessibility_new</md-icon>
      </md-icon-button>
    `;
    document.body.prepend(btn); // Insert at the very top of body

    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-a11y';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Barrierefreiheit & Farbfilter');

    let optionsHtml = '';
    const currentMode = localStorage.getItem(STORAGE_KEY) || 'normal';

    MODES.forEach((mode, index) => {
      const isSelected = mode.id === currentMode;
      optionsHtml += `
        <div class="a11y-option" data-mode="${mode.id}"
             role="radio" tabindex="${index === 0 ? '0' : '-1'}"
             aria-checked="${isSelected ? 'true' : 'false'}"
             style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--button-bg); border: 1px solid ${isSelected ? 'var(--md-sys-color-primary)' : 'var(--button-border)'}; border-radius: var(--md-sys-shape-corner-medium); margin-bottom: 8px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <md-icon aria-hidden="true" style="color: var(--md-sys-color-primary)">${mode.icon}</md-icon>
            <span>${mode.name}</span>
          </div>
          <md-icon class="a11y-check" aria-hidden="true" style="opacity: ${isSelected ? '1' : '0'}; color: var(--md-sys-color-primary)">check_circle</md-icon>
        </div>
      `;
    });

    const noAnimSelected = localStorage.getItem(ANIM_KEY) === 'true';
    const simpleSelected = localStorage.getItem(SIMPLE_KEY) === 'true';

    modal.innerHTML = `
      <div class="modal-content">
        <div class="close-modal" id="a11y-close-btn">
          <md-icon-button aria-label="Schließen">
            <md-icon aria-hidden="true">close</md-icon>
          </md-icon-button>
        </div>
        <h2><md-icon aria-hidden="true">visibility</md-icon> Barrierefreiheit</h2>
        <p>Wähle einen Modus, um die Darstellung der Website an deine Bedürfnisse anzupassen.</p>
        <div role="radiogroup" aria-label="Farbfilter-Auswahl" style="margin-top: 24px;">
          ${optionsHtml}
        </div>

        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--card-border);">
          <h3 style="margin-top: 0; font-size: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Google Sans', sans-serif;">
            <md-icon aria-hidden="true">tune</md-icon> Weitere Optionen
          </h3>
          
          <div class="a11y-toggle" id="a11y-toggle-anim"
               role="switch" tabindex="0"
               aria-checked="${noAnimSelected ? 'true' : 'false'}"
               style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--button-bg); border: 1px solid ${noAnimSelected ? 'var(--md-sys-color-primary)' : 'var(--button-border)'}; border-radius: var(--md-sys-shape-corner-medium); margin-bottom: 8px; cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <md-icon aria-hidden="true" style="color: var(--md-sys-color-primary)">animation</md-icon>
              <span>Animationen deaktivieren</span>
            </div>
            <md-icon class="a11y-check" aria-hidden="true" style="opacity: ${noAnimSelected ? '1' : '0'}; color: var(--md-sys-color-primary)">check_circle</md-icon>
          </div>

          <div class="a11y-toggle" id="a11y-toggle-simple"
               role="switch" tabindex="0"
               aria-checked="${simpleSelected ? 'true' : 'false'}"
               style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--button-bg); border: 1px solid ${simpleSelected ? 'var(--md-sys-color-primary)' : 'var(--button-border)'}; border-radius: var(--md-sys-shape-corner-medium); margin-bottom: 8px; cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <md-icon aria-hidden="true" style="color: var(--md-sys-color-primary)">text_format</md-icon>
              <span>Vereinfachte Ansicht (Hoher Kontrast)</span>
            </div>
            <md-icon class="a11y-check" aria-hidden="true" style="opacity: ${simpleSelected ? '1' : '0'}; color: var(--md-sys-color-primary)">check_circle</md-icon>
          </div>
        </div>

        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--card-border);">
          <h3 style="margin-top: 0; font-size: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Google Sans', sans-serif;">
            <md-icon aria-hidden="true">zoom_in</md-icon> Website-Größe anpassen
          </h3>
          <p style="font-size: 14px; margin-top: 4px; margin-bottom: 16px; color: var(--text-secondary);">Macht Texte und Elemente größer oder kleiner.</p>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span style="font-size: 14px; width: 40px; text-align: right;">100%</span>
            <input type="range" id="a11y-zoom-slider" min="100" max="150" step="10" value="${getSavedZoom()}"
                   aria-label="Website-Zoom"
                   style="flex: 1; accent-color: var(--md-sys-color-primary); cursor: pointer;">
            <span style="font-size: 14px; width: 45px;" id="a11y-zoom-val" aria-live="polite">${getSavedZoom()}%</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // -- Events --

    // Open modal
    btn.addEventListener('click', () => openModal(modal));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(modal);
      }
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    // Close button
    const closeBtn = document.getElementById('a11y-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Toggle Events
    const toggleAnim = document.getElementById('a11y-toggle-anim');
    const toggleSimple = document.getElementById('a11y-toggle-simple');

    const handleToggle = (opt, key, className) => {
      opt.addEventListener('click', () => toggleSetting(key, opt, className));
      opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSetting(key, opt, className);
        }
      });
      opt.addEventListener('mouseenter', () => {
        if (localStorage.getItem(key) !== 'true') opt.style.background = 'var(--button-hover-bg)';
      });
      opt.addEventListener('mouseleave', () => {
        opt.style.background = 'var(--button-bg)';
      });
    };

    handleToggle(toggleAnim, ANIM_KEY, 'a11y-reduced-motion');
    handleToggle(toggleSimple, SIMPLE_KEY, 'a11y-simple-mode');

    // Escape to close
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(modal);
        return;
      }

      // Focus trap: Tab and Shift+Tab cycle within the modal
      if (e.key === 'Tab') {
        const allFocusable = Array.from(modal.querySelectorAll(
          'md-icon-button, .a11y-option, .a11y-toggle, input[type="range"]'
        ));
        // Remove options that are not focusable (tabindex="-1")
        const visibleFocusable = allFocusable.filter(el => el.getAttribute('tabindex') !== '-1');

        if (visibleFocusable.length === 0) return;

        const first = visibleFocusable[0];
        const last = visibleFocusable[visibleFocusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Option selection and keyboard navigation
    const options = Array.from(document.querySelectorAll('.a11y-option'));
    options.forEach((opt, index) => {
      opt.addEventListener('click', () => selectOption(opt, options));

      opt.addEventListener('keydown', (e) => {
        let targetIndex = -1;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (index + 1) % options.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (index - 1 + options.length) % options.length;
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOption(opt, options);
          return;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = options.length - 1;
        }

        if (targetIndex >= 0) {
          // Move roving tabindex
          options.forEach(o => o.setAttribute('tabindex', '-1'));
          options[targetIndex].setAttribute('tabindex', '0');
          options[targetIndex].focus();
        }
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

    // Zoom slider
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
