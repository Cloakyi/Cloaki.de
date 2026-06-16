/**
 * Domain Guard – Cloaki.de
 * Redirects all traffic from non-primary domains (e.g. cloak-studio.web.app)
 * to the canonical domain cloaki.de while preserving the full path and hash.
 * Include in <head> with: <script src="/domain-guard.js"></script>
 */
(function () {
  'use strict';
  var CANONICAL = 'cloaki.de';
  if (
    window.location.hostname !== CANONICAL &&
    window.location.hostname !== 'www.' + CANONICAL
  ) {
    window.location.replace(
      'https://' + CANONICAL + window.location.pathname + window.location.search + window.location.hash
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Theme Engine (Konsolidiert)
  // ─────────────────────────────────────────────────────────────
  
  // Expose to global scope for the inline toggle buttons
  window.setCookie = function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
  };

  window.getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  window.initTheme = function() {
    var theme = window.getCookie("theme");
    // System Theme Fallback if no cookie exists
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme = "light";
      } else {
        theme = "dark"; // Default
      }
    }
    
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  };

  window.toggleTheme = function() {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode");
      window.setCookie("theme", "dark", 365);
    } else {
      document.body.classList.add("light-mode");
      window.setCookie("theme", "light", 365);
    }
  };

  // Run immediately to prevent FOUC (if script is loaded early enough)
  if (document.body) window.initTheme();

  // Stinger Transition & Loader Logic
  document.addEventListener("DOMContentLoaded", function () {
    // Ensure theme is applied once body is guaranteed to exist
    window.initTheme();

    var loader = document.getElementById("global-loader");
    if (!loader) return;

    // If coming from another page via stinger, we ensure it's visible and let the 
    // existing window.load event handle hiding it (sweeping it right).
    if (sessionStorage.getItem('stinger_active') === 'true') {
      sessionStorage.removeItem('stinger_active');
      loader.classList.remove('hidden', 'stinger-prep', 'stinger-enter');
    }

    // Fix for browser "Back" button: ensure the loader is hidden if we navigate back
    window.addEventListener("pageshow", function (e) {
      if (e.persisted && loader) {
        loader.classList.remove('stinger-prep', 'stinger-enter');
        loader.classList.add('hidden');
      }
    });

    // Helper function for inline onclick handlers
    window.triggerStingerAndNavigate = function (url) {
      if (!loader || loader.classList.contains('stinger-enter')) return;

      loader.classList.remove('hidden', 'stinger-enter');
      loader.classList.add('stinger-prep');

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          loader.classList.remove('stinger-prep');
          loader.classList.add('stinger-enter');
        });
      });

      setTimeout(function () {
        sessionStorage.setItem('stinger_active', 'true');
        if (url === 'back') {
          history.back();
        } else {
          window.location.href = url;
        }
      }, 700);
    };

    // Intercept clicks for internal links
    document.addEventListener("click", function (e) {
      // Check if it's a link
      var link = e.target.closest("a");
      var targetUrl = link ? link.href : null;
      var hrefAttr = link ? link.getAttribute("href") : null;

      if (!link) return;

      if (!hrefAttr || hrefAttr.startsWith("#") || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:") || hrefAttr.startsWith("javascript:")) {
        return;
      }

      var isInternal = link.host === window.location.host;
      var isBlank = link.target === "_blank";
      var isDownload = link.hasAttribute("download");
      var isLegalModal = hrefAttr && (hrefAttr.indexOf('/impressum') !== -1 || hrefAttr.indexOf('/datenschutz') !== -1 || hrefAttr.indexOf('/haftung') !== -1);

      if (isInternal && !isBlank && !isDownload && !isLegalModal && !loader.classList.contains('stinger-enter')) {
        e.preventDefault();

        // 1. Prepare stinger on the left side (invisible to user as it's offscreen)
        loader.classList.remove('hidden', 'stinger-enter');
        loader.classList.add('stinger-prep');

        // 2. Trigger sweep animation reliably via requestAnimationFrame
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            loader.classList.remove('stinger-prep');
            loader.classList.add('stinger-enter');
          });
        });

        // 3. Wait for screen to be fully covered, then navigate
        setTimeout(function () {
          sessionStorage.setItem('stinger_active', 'true');
          window.location.href = targetUrl;
        }, 700);
      }
    });

    // Dynamically set animation delays for rule cards to replace hardcoded CSS
    document.querySelectorAll('.rule-card').forEach(function(card, i) {
      card.style.animationDelay = (0.1 * (i + 1)) + 's';
    });
  });
})();
