/**
 * Cookie Consent Banner – Cloaki.de
 * Self-contained module: injects its own CSS & HTML.
 * Include with <script src="/cookie-banner.js" defer></script>
 *
 * Compact by default – expands via arrow to show category toggles.
 * Persists choices in localStorage so settings survive across pages and sessions.
 * GDPR-compliant: optional cookies default to OFF.
 */
(function () {
  'use strict';

  /* ───── configuration ───── */
  const STORAGE_KEY = 'cloaki_cookie_consent';
  const CATEGORIES = [
    {
      id: 'necessary',
      label: 'Notwendig',
      description: 'Technisch erforderliche Cookies (z.\u00a0B. Theme-Auswahl).',
      locked: true,
      default: true,
      icon: 'lock'
    },
    {
      id: 'functional',
      label: 'Funktional',
      description: 'Cookies für zusätzliche Funktionen und Personalisierung.',
      locked: false,
      default: false,
      icon: 'tune'
    },
    {
      id: 'analytics',
      label: 'Analyse',
      description: 'Cookies zur Analyse und Verbesserung der Website.',
      locked: false,
      default: false,
      icon: 'bar_chart'
    }
  ];

  /* ───── inject CSS ───── */
  const style = document.createElement('style');
  style.textContent = `
/* ============================================
   COOKIE BANNER – M3 GLASSMORPHISM
   ============================================ */
#cloakiCookieBanner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

#cloakiCookieBanner .cb-card {
  pointer-events: auto;
  width: 100%;
  max-width: 520px;
  background: var(--profile-bg, rgba(17, 19, 24, 0.82));
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid var(--card-border, rgba(255,255,255,0.08));
  border-radius: var(--md-sys-shape-corner-extra-large, 28px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18);
  padding: 24px 28px 20px;
  color: var(--text-color, #e2e2e6);
  font-family: 'Outfit', 'Roboto', 'Segoe UI', sans-serif;

  /* entrance animation */
  transform: translateY(110%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.2, 0, 0, 1),
              opacity 0.4s cubic-bezier(0.2, 0, 0, 1);
}

#cloakiCookieBanner.cb-visible .cb-card {
  transform: translateY(0);
  opacity: 1;
}

#cloakiCookieBanner.cb-hiding .cb-card {
  transform: translateY(110%);
  opacity: 0;
}

/* ── header row ── */
#cloakiCookieBanner .cb-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

#cloakiCookieBanner .cb-header-icon {
  font-family: 'Material Symbols Outlined';
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: var(--md-sys-color-primary, #a0c4ff);
  font-weight: 400;
  font-style: normal;
  line-height: 24px;
  overflow: visible;
  flex-shrink: 0;
  -webkit-font-smoothing: antialiased;
}

#cloakiCookieBanner .cb-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
  flex: 1;
}

#cloakiCookieBanner .cb-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary, rgba(226,226,230,0.7));
  margin-bottom: 16px;
}

/* ── expand toggle ── */
#cloakiCookieBanner .cb-expand-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--button-border, rgba(67,71,78,0.4));
  border-radius: var(--md-sys-shape-corner-small, 8px);
  color: var(--text-secondary, rgba(226,226,230,0.7));
  font-family: 'Outfit', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  padding: 7px 14px;
  margin-bottom: 16px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  letter-spacing: 0.2px;
}

#cloakiCookieBanner .cb-expand-btn:hover {
  background: var(--button-bg, rgba(40,42,47,0.5));
  color: var(--text-color, #e2e2e6);
  border-color: var(--button-border, rgba(67,71,78,0.7));
}

#cloakiCookieBanner .cb-expand-arrow {
  font-family: 'Material Symbols Outlined';
  font-size: 18px;
  width: 18px;
  height: 18px;
  min-width: 18px;
  font-weight: 400;
  font-style: normal;
  line-height: 18px;
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
}

#cloakiCookieBanner .cb-expand-btn.cb-open .cb-expand-arrow {
  transform: rotate(180deg);
}

/* ── collapsible categories ── */
#cloakiCookieBanner .cb-details-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.2, 0, 0, 1);
}

#cloakiCookieBanner .cb-details-wrapper.cb-expanded {
  grid-template-rows: 1fr;
}

#cloakiCookieBanner .cb-details-inner {
  overflow: hidden;
}

#cloakiCookieBanner .cb-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
}

#cloakiCookieBanner .cb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--button-bg, rgba(40,42,47,0.7));
  border: 1px solid var(--button-border, rgba(67,71,78,0.6));
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  padding: 11px 14px;
  transition: background 0.2s ease, border-color 0.2s ease;
}

#cloakiCookieBanner .cb-row:hover {
  background: var(--button-hover-bg, rgba(50,53,58,0.8));
}

#cloakiCookieBanner .cb-row-icon {
  font-family: 'Material Symbols Outlined';
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: var(--md-sys-color-primary, #a0c4ff);
  opacity: 0.85;
  flex-shrink: 0;
  font-weight: 400;
  font-style: normal;
  line-height: 20px;
  overflow: visible;
  -webkit-font-smoothing: antialiased;
}

#cloakiCookieBanner .cb-row-text {
  flex: 1;
  min-width: 0;
}

#cloakiCookieBanner .cb-row-label {
  font-family: 'Outfit', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.1px;
}

#cloakiCookieBanner .cb-row-desc {
  font-size: 11px;
  color: var(--text-secondary, rgba(226,226,230,0.55));
  line-height: 1.4;
  margin-top: 1px;
}

/* ── toggle switch ── */
#cloakiCookieBanner .cb-toggle {
  position: relative;
  width: 42px;
  height: 24px;
  flex-shrink: 0;
}

#cloakiCookieBanner .cb-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

#cloakiCookieBanner .cb-slider {
  position: absolute;
  inset: 0;
  background: var(--md-sys-color-outline-variant, #43474e);
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.25s ease;
}

#cloakiCookieBanner .cb-slider::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--md-sys-color-on-surface, #e2e2e6);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.25s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

#cloakiCookieBanner .cb-toggle input:checked + .cb-slider {
  background: var(--md-sys-color-primary, #a0c4ff);
}

#cloakiCookieBanner .cb-toggle input:checked + .cb-slider::after {
  transform: translateX(18px);
  background: var(--md-sys-color-on-primary, #003060);
}

#cloakiCookieBanner .cb-toggle input:disabled + .cb-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

#cloakiCookieBanner .cb-toggle input:focus-visible + .cb-slider {
  outline: 2px solid var(--md-sys-color-primary, #a0c4ff);
  outline-offset: 2px;
}

/* ── buttons ── */
#cloakiCookieBanner .cb-actions {
  display: flex;
  gap: 10px;
}

#cloakiCookieBanner .cb-btn {
  flex: 1;
  padding: 11px 16px;
  border: none;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
}

#cloakiCookieBanner .cb-btn:active {
  transform: scale(0.97);
}

#cloakiCookieBanner .cb-btn-decline {
  background: var(--button-bg, rgba(40,42,47,0.7));
  color: var(--text-color, #e2e2e6);
  border: 1px solid var(--button-border, rgba(67,71,78,0.6));
}

#cloakiCookieBanner .cb-btn-decline:hover {
  background: var(--button-hover-bg, rgba(50,53,58,0.8));
}

#cloakiCookieBanner .cb-btn-save {
  background: var(--button-bg, rgba(40,42,47,0.7));
  color: var(--text-color, #e2e2e6);
  border: 1px solid var(--button-border, rgba(67,71,78,0.6));
}

#cloakiCookieBanner .cb-btn-save:hover {
  background: var(--button-hover-bg, rgba(50,53,58,0.8));
}

#cloakiCookieBanner .cb-btn-accept {
  background: var(--md-sys-color-primary, #a0c4ff);
  color: var(--md-sys-color-on-primary, #003060);
}

#cloakiCookieBanner .cb-btn-accept:hover {
  box-shadow: 0 4px 14px rgba(160, 196, 255, 0.25);
  filter: brightness(1.08);
}

/* Show/hide save button based on expanded state */
#cloakiCookieBanner .cb-btn-save {
  display: none;
}

#cloakiCookieBanner.cb-details-open .cb-btn-save {
  display: block;
}

/* ── gear button (reopen settings) ── */
#cloakiCookieGear {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9998;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--button-border, rgba(67,71,78,0.6));
  background: var(--profile-bg, rgba(17, 19, 24, 0.82));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant, #c3c6cf);
  font-family: 'Material Symbols Outlined';
  font-size: 24px;
  font-weight: 400;
  font-style: normal;
  line-height: 48px;
  overflow: visible;
  -webkit-font-smoothing: antialiased;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s ease, opacity 0.3s ease, background 0.2s ease, box-shadow 0.2s ease;
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}

#cloakiCookieGear.cb-gear-visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

#cloakiCookieGear.cb-gear-visible:hover {
  background: var(--button-hover-bg, rgba(50,53,58,0.8));
  transform: scale(1.06);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* ── responsive ── */
@media (max-width: 540px) {
  #cloakiCookieBanner {
    padding: 10px;
  }
  #cloakiCookieBanner .cb-card {
    padding: 20px 18px 16px;
    border-radius: 22px;
  }
  #cloakiCookieBanner .cb-actions {
    flex-direction: column;
    gap: 8px;
  }
  #cloakiCookieBanner .cb-row {
    padding: 10px 12px;
  }
}
`;
  document.head.appendChild(style);

  /* ───── helpers ───── */
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* ignore */ }
    return null;
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) { /* ignore */ }
  }

  /* ───── build DOM ───── */
  function createBanner() {
    const wrapper = document.createElement('div');
    wrapper.id = 'cloakiCookieBanner';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-label', 'Cookie-Einstellungen');

    const card = document.createElement('div');
    card.className = 'cb-card';

    card.innerHTML = `
      <div class="cb-header">
        <span class="cb-header-icon" aria-hidden="true">cookie</span>
        <span class="cb-title">Cookie-Einstellungen</span>
      </div>
      <div class="cb-desc">
        Wir verwenden Cookies, um dir die bestmögliche Erfahrung zu bieten.
      </div>

      <button class="cb-expand-btn" id="cbExpandBtn" type="button" aria-expanded="false">
        <span>Details anpassen</span>
        <span class="cb-expand-arrow" aria-hidden="true">expand_more</span>
      </button>

      <div class="cb-details-wrapper" id="cbDetailsWrapper">
        <div class="cb-details-inner">
          <div class="cb-categories" id="cbCategories"></div>
        </div>
      </div>

      <div class="cb-actions">
        <button class="cb-btn cb-btn-decline" id="cbDecline" type="button">Nur notwendige</button>
        <button class="cb-btn cb-btn-save" id="cbSave" type="button">Auswahl speichern</button>
        <button class="cb-btn cb-btn-accept" id="cbAccept" type="button">Alle akzeptieren</button>
      </div>
    `;

    // build category rows
    const catContainer = card.querySelector('#cbCategories');
    CATEGORIES.forEach(cat => {
      const row = document.createElement('div');
      row.className = 'cb-row';
      row.innerHTML = `
        <span class="cb-row-icon" aria-hidden="true">${cat.icon}</span>
        <div class="cb-row-text">
          <div class="cb-row-label">${cat.label}</div>
          <div class="cb-row-desc">${cat.description}</div>
        </div>
        <label class="cb-toggle">
          <input type="checkbox" id="cb-cat-${cat.id}"
                 ${cat.default ? 'checked' : ''}
                 ${cat.locked ? 'disabled checked' : ''}
                 aria-label="${cat.label}">
          <span class="cb-slider"></span>
        </label>
      `;
      catContainer.appendChild(row);
    });

    wrapper.appendChild(card);
    return wrapper;
  }

  function createGearButton() {
    const btn = document.createElement('button');
    btn.id = 'cloakiCookieGear';
    btn.setAttribute('aria-label', 'Cookie-Einstellungen öffnen');
    btn.setAttribute('type', 'button');
    btn.textContent = 'cookie';
    return btn;
  }

  /* ───── controller ───── */
  function init() {
    const prefs = loadPrefs();
    const banner = createBanner();
    const gear = createGearButton();
    document.body.appendChild(banner);
    document.body.appendChild(gear);

    const expandBtn = document.getElementById('cbExpandBtn');
    const detailsWrapper = document.getElementById('cbDetailsWrapper');

    function readToggles() {
      const result = {};
      CATEGORIES.forEach(cat => {
        const cb = document.getElementById('cb-cat-' + cat.id);
        result[cat.id] = cb ? cb.checked : cat.default;
      });
      return result;
    }

    function applyPrefs(p) {
      CATEGORIES.forEach(cat => {
        const cb = document.getElementById('cb-cat-' + cat.id);
        if (cb && !cat.locked) cb.checked = !!p[cat.id];
      });
    }

    function setAllOptional(state) {
      CATEGORIES.forEach(cat => {
        const cb = document.getElementById('cb-cat-' + cat.id);
        if (cb && !cat.locked) cb.checked = state;
      });
    }

    function toggleDetails(forceOpen) {
      const isOpen = detailsWrapper.classList.contains('cb-expanded');
      const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;

      if (shouldOpen) {
        detailsWrapper.classList.add('cb-expanded');
        expandBtn.classList.add('cb-open');
        expandBtn.setAttribute('aria-expanded', 'true');
        banner.classList.add('cb-details-open');
      } else {
        detailsWrapper.classList.remove('cb-expanded');
        expandBtn.classList.remove('cb-open');
        expandBtn.setAttribute('aria-expanded', 'false');
        banner.classList.remove('cb-details-open');
      }
    }

    function showBanner() {
      gear.classList.remove('cb-gear-visible');
      banner.classList.remove('cb-hiding');
      toggleDetails(false); // start collapsed
      void banner.offsetHeight;
      banner.classList.add('cb-visible');
    }

    function hideBanner() {
      banner.classList.add('cb-hiding');
      banner.classList.remove('cb-visible');
      setTimeout(() => {
        banner.classList.remove('cb-hiding');
        gear.classList.add('cb-gear-visible');
      }, 500);
    }

    function saveAndClose() {
      const p = readToggles();
      p._timestamp = Date.now();
      savePrefs(p);
      hideBanner();
      dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: p }));
    }

    function acceptAll() {
      setAllOptional(true);
      saveAndClose();
    }

    function declineOptional() {
      setAllOptional(false);
      saveAndClose();
    }

    // wire up buttons
    expandBtn.addEventListener('click', () => toggleDetails());
    document.getElementById('cbAccept').addEventListener('click', acceptAll);
    document.getElementById('cbDecline').addEventListener('click', declineOptional);
    document.getElementById('cbSave').addEventListener('click', saveAndClose);
    gear.addEventListener('click', () => {
      const p = loadPrefs();
      if (p) applyPrefs(p);
      showBanner();
    });

    // if user has already set prefs, just show the gear
    if (prefs) {
      applyPrefs(prefs);
      gear.classList.add('cb-gear-visible');
    } else {
      // first visit – show banner after a short delay
      setTimeout(showBanner, 600);
    }

    /* public API */
    window.CookieConsent = {
      getPrefs: loadPrefs,
      isAllowed: function (category) {
        const p = loadPrefs();
        if (!p) return CATEGORIES.find(c => c.id === category)?.default ?? false;
        return !!p[category];
      },
      show: showBanner
    };
  }

  /* ───── kick off ───── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

