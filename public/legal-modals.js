/**
 * Legal Modals – Cloaki.de
 * Self-contained module: injects modal HTML, CSS & logic.
 * Opens Impressum, Datenschutz, Haftungsausschluss modals in-place on any page.
 * Skips injection if modals already exist (e.g. on the main page).
 * Include with: <script src="/legal-modals.js" defer></script>
 */
(function () {
  'use strict';

  /* ───── modal HTML content ───── */
  var MODALS = {
    'modal-impressum': {
      title: 'Impressum',
      body: '<p><strong>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG):</strong></p>'
        + '<p>Paul Häuser<br>Eichenstraße 59<br>07549 Gera<br>Deutschland</p>'
        + '<p><strong>Kontakt:</strong><br>'
        + 'E-Mail: <a href="mailto:owner@cloaki.de">owner@cloaki.de</a><br>'
        + 'Tel.: <a href="tel:+4915256958193">+49 1525 6958193</a></p>'
        + '<p><strong>Hinweis:</strong><br>Für den Versand von Paketen oder physischen Anfragen bitten wir um vorherige '
        + 'Kontaktaufnahme per E-Mail. Die genannte Anschrift dient ausschließlich der Impressumspflicht und ist keine '
        + 'Absenderadresse für Rücksendungen oder Warenversand.</p>'
        + '<hr style="border:none;border-top:1px solid var(--lm-border,rgba(147,197,253,0.12));margin:24px 0;">'
        + '<h3>Geltungsbereich</h3>'
        + '<p>Dieses Impressum gilt für die Website <strong>cloaki-studio.web.app</strong>, <strong>cloaki.de</strong> sowie '
        + 'für sämtliche Onlinepräsenzen, die eindeutig auf diese Website verlinken oder als Teil meines privaten Netzwerks '
        + 'erkennbar sind, insbesondere:</p>'
        + '<ul style="list-style-position:inside;padding-left:0;">'
        + '<li>meinen YouTube-Kanal</li><li>meinen Twitch-Kanal</li><li>meinen Discord-Server</li>'
        + '<li>mein Steam-Profil</li><li>mein Epicgames-Profil</li><li>mein GitHub-Profil</li>'
        + '<li>mein Instagram-Profil</li><li>mein VRChat-Profil</li></ul>'
    },
    'modal-datenschutz': {
      title: 'Datenschutz',
      body: '<h3>Geltungsbereich</h3>'
        + '<p>Diese Datenschutzerklärung gilt in erster Linie für die Websites <strong>https://cloaki.de</strong> und '
        + '<strong>https://cloak-studio.web.app</strong>. Zusätzlich umfasst sie das Minecraft-Projekt „NuggetSMP" unter '
        + '<strong>https://NuggetSMP.fun</strong>.</p>'
        + '<p>Sie gilt ebenfalls für alle zugehörigen Discord-Server (Community-Server, Minecraft-Discord) und '
        + 'Partner-Communities, soweit sie von derselben verantwortlichen Person betrieben oder direkt verknüpft sind. Die '
        + 'Nutzung oder Übernahme dieser Datenschutzerklärung durch Dritte ist nicht gestattet.</p>'
        + '<h3>Allgemeines</h3>'
        + '<p>Der Schutz personenbezogener Daten ist mir wichtig. Diese Projekte sind privat und nicht-kommerziell. Es werden '
        + 'ausschließlich technisch notwendige Informationen verarbeitet – z.\u00a0B. zur Anzeige von Darstellungsoptionen '
        + '(Dark-/Light-Modus) oder zur stabilen Auslieferung der Seite.</p>'
        + '<h3>Verantwortliche Stelle</h3>'
        + '<p>Verantwortlich im Sinne der DSGVO ist die im <a class="lm-link" data-target="modal-impressum">Impressum</a> '
        + 'genannte Person.<br>Kontakt: <a href="mailto:cloaki.yt@gmail.com">cloaki.yt@gmail.com</a></p>'
        + '<h3>Hosting (Firebase &amp; Google Workspace)</h3>'
        + '<p>Das Hosting erfolgt über <strong>Firebase Hosting</strong>. Für die Altersverifizierung wird <strong>Google '
        + 'Forms</strong> genutzt (beides Google LLC).</p>'
        + '<ul><li>Google ist Auftragsverarbeiter nach Art. 28 DSGVO.</li>'
        + '<li>Datentransfers erfolgen gemäß <strong>EU-US Data Privacy Framework</strong>.</li>'
        + '<li>Gespeicherte Verbindungsdaten: IP-Adresse, Datum/Uhrzeit, Browsertyp, Betriebssystem.</li>'
        + '<li>Daten werden ausschließlich zu Sicherheits-, Stabilitäts- und Verifizierungszwecken verarbeitet.</li></ul>'
        + '<h3>Altersverifizierung (Discord &amp; VRChat)</h3>'
        + '<p>Für den Zugriff auf altersbeschränkte Bereiche führen wir eine manuelle Verifizierung durch:</p>'
        + '<ul><li><strong>Ablauf:</strong> Eröffnung eines Tickets auf Discord, Gespräch in einem Voice-Call, Nachweis eines '
        + 'verifizierten VRChat-Accounts sowie Abgleich via E-Mail-Bestätigungscode.</li>'
        + '<li><strong>Speicherung:</strong> Die Daten werden in einem passwortgeschützten Google Formular erfasst. Zugriff '
        + 'hat ausschließlich die Projektleitung. Die Ergebnisse werden zum Ende jeden Monats vollständig und manuell gelöscht.</li></ul>'
        + '<h3>Speicherdauer &amp; Speicherort</h3>'
        + '<p>Serverprotokolle des Minecraft-Projekts werden ca. 30 Tage vorgehalten. Archivierte Log-Auszüge zur '
        + 'Beweissicherung werden nach spätestens 15 Monaten gelöscht. Daten aus der Altersverifizierung werden monatlich gelöscht.</p>'
        + '<p><strong>Stand:</strong> Aktualisiert: 22. Februar 2026</p>'
    },
    'modal-haftung': {
      title: 'Haftungsausschluss',
      body: '<h3>Geltungsbereich</h3>'
        + '<p>Dieser Haftungsausschluss gilt für die Websites <strong>https://cloaki.de</strong>, '
        + '<strong>https://cloak-studio.web.app</strong> sowie für das Minecraft-Projekt <strong>NuggetSMP</strong> unter '
        + '<strong>https://NuggetSMP.fun</strong>.</p>'
        + '<h3>Privater Charakter &amp; Monetarisierung</h3>'
        + '<p>Diese Angebote sind privat. Über Plattformen wie TikTok oder <strong>Ko-fi</strong> können freiwillige '
        + 'Zuwendungen (Spenden) entstehen. Diese dienen der Finanzierung privater Projekte (z.\u00a0B. Hardware-Ziele) und '
        + 'stellen keine gewerbliche Tätigkeit dar.</p>'
        + '<h3>Haftung für Inhalte &amp; Links</h3>'
        + '<p>Die Inhalte wurden mit Sorgfalt erstellt. Für Richtigkeit und Aktualität übernehme ich keine Gewähr. Externe '
        + 'Partner-Communities werden lediglich verlinkt; für deren Inhalte sind die jeweiligen Betreiber verantwortlich.</p>'
        + '<h3>Discord &amp; Minecraft</h3>'
        + '<ul><li>Die Teilnahme am Discord und am Minecraft-Server ist freiwillig.</li>'
        + '<li>Moderationsmaßnahmen liegen im Ermessen des Teams; es besteht kein Anspruch auf Teilnahme.</li>'
        + '<li>Für technische Störungen oder Datenverlust wird keine Haftung übernommen.</li>'
        + '<li><strong>SimpleVoiceChat:</strong> Sprachbeiträge können in Streams/Videos Dritter erscheinen.</li></ul>'
        + '<h3>Urheberrecht</h3>'
        + '<p>Eigene Inhalte (Grafiken, Texte, Banner) unterliegen meinem Urheberrecht. Eine Nutzung ohne Genehmigung ist untersagt.</p>'
        + '<h3>Datenschutz</h3>'
        + '<p>Hinweise zur Datenverarbeitung findest du in der <a class="lm-link" data-target="modal-datenschutz">Datenschutzerklärung</a>.</p>'
        + '<p><strong>Stand:</strong> Aktualisiert: 22. Februar 2026</p>'
    }
  };

  /* ───── inject CSS (for pages without style.css modal styles) ───── */
  var style = document.createElement('style');
  style.id = 'legal-modals-css';
  style.textContent = [
    ':root{',
    '  --lm-bg:var(--modal-bg,rgba(17,19,24,0.88));',
    '  --lm-text:var(--text-color,#e2e2e6);',
    '  --lm-text2:var(--text-secondary,rgba(226,226,230,0.7));',
    '  --lm-border:var(--card-border,rgba(147,197,253,0.12));',
    '  --lm-link:var(--footer-link-color,#a0c4ff);',
    '  --lm-radius:var(--md-sys-shape-corner-extra-large,28px);',
    '}',
    '.lm-overlay{',
    '  position:fixed;top:0;left:0;width:100%;height:100%;',
    '  background:rgba(0,0,0,0.32);',
    '  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
    '  display:flex;align-items:center;justify-content:center;',
    '  opacity:0;visibility:hidden;',
    '  transition:opacity 0.3s cubic-bezier(0.2,0,0,1),visibility 0.3s;',
    '  z-index:5000;padding:24px;box-sizing:border-box;',
    '  overscroll-behavior:contain;',
    '}',
    '.lm-overlay.lm-active{opacity:1;visibility:visible;}',
    '.lm-panel{',
    '  background:var(--lm-bg);',
    '  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);',
    '  width:100%;max-width:650px;max-height:85vh;',
    '  border-radius:var(--lm-radius);padding:32px;',
    '  overflow-y:auto;position:relative;',
    '  transform:scale(0.92) translateY(16px);',
    '  transition:transform 0.5s cubic-bezier(0.2,0,0,1);',
    '  box-shadow:0 8px 32px rgba(0,0,0,0.24);',
    '  border:1px solid var(--lm-border);',
    '  color:var(--lm-text);',
    '  font-family:"Google Sans Text","Google Sans","Roboto",sans-serif;',
    '  overscroll-behavior:contain;',
    '}',
    '.lm-overlay.lm-active .lm-panel{transform:scale(1) translateY(0);}',
    '.lm-panel::-webkit-scrollbar{width:8px;}',
    '.lm-panel::-webkit-scrollbar-track{background:transparent;margin:16px 0;}',
    '.lm-panel::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:9999px;}',
    '.lm-panel::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.3);}',
    '.lm-panel h2{margin-top:0;margin-bottom:16px;font-size:24px;font-family:"Google Sans","Fredoka",sans-serif;font-weight:500;}',
    '.lm-panel h3{margin-top:24px;font-size:16px;font-family:"Google Sans","Fredoka",sans-serif;font-weight:500;letter-spacing:0.1px;}',
    '.lm-panel p,.lm-panel li{line-height:1.7;color:var(--lm-text2);font-size:14px;}',
    '.lm-panel a{color:var(--lm-link);text-decoration:underline;cursor:pointer;transition:opacity 0.2s;}',
    '.lm-panel a:hover{opacity:0.8;}',
    '.lm-close{',
    '  position:absolute;top:16px;right:16px;z-index:1;',
    '  width:40px;height:40px;border:none;background:none;',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  font-family:"Material Symbols Outlined";font-size:24px;font-weight:400;font-style:normal;',
    '  color:var(--lm-text2);border-radius:50%;',
    '  transition:background 0.2s,color 0.2s;line-height:1;',
    '}',
    '.lm-close:hover{background:rgba(255,255,255,0.08);color:var(--lm-text);}',
    '@media(max-width:600px){',
    '  .lm-panel{padding:24px;border-radius:22px;}',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  /* ───── state ───── */
  var overlays = {};

  /* ───── create modal DOM ───── */
  function createModal(id, data) {
    var overlay = document.createElement('div');
    overlay.className = 'lm-overlay';
    overlay.id = id;
    overlay.innerHTML =
      '<div class="lm-panel">' +
        '<button class="lm-close" aria-label="Schließen" type="button">close</button>' +
        '<h2>' + data.title + '</h2>' +
        data.body +
      '</div>';
    return overlay;
  }

  /* ───── open / close ───── */
  function openModal(id) {
    closeAll();
    var el = overlays[id];
    if (el) {
      el.classList.add('lm-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAll() {
    Object.keys(overlays).forEach(function (k) {
      overlays[k].classList.remove('lm-active');
    });
    document.body.style.overflow = '';
  }

  /* ───── URL-to-modal mapping ───── */
  var URL_MAP = {
    '/impressum': 'modal-impressum',
    '/impressum/': 'modal-impressum',
    '/datenschutz': 'modal-datenschutz',
    '/datenschutz/': 'modal-datenschutz',
    '/haftung': 'modal-haftung',
    '/haftung/': 'modal-haftung',
    '../impressum/': 'modal-impressum',
    '../datenschutz/': 'modal-datenschutz',
    '../haftung/': 'modal-haftung'
  };

  /* ───── init ───── */
  function init() {
    // Create modals only if they don't already exist in the DOM
    Object.keys(MODALS).forEach(function (id) {
      if (!document.getElementById(id)) {
        var el = createModal(id, MODALS[id]);
        document.body.appendChild(el);
        overlays[id] = el;

        // click overlay to close
        el.addEventListener('click', function (e) {
          if (e.target === el) closeAll();
        });

        // close button
        el.querySelector('.lm-close').addEventListener('click', closeAll);
      }
    });

    // Intercept clicks on links pointing to /impressum/, /datenschutz/, /haftung/
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a[href], .lm-link[data-target], .modal-link[data-target]');
      if (!target) return;

      // Handle data-target links (modal-link or lm-link class)
      var dt = target.getAttribute('data-target');
      if (dt && overlays[dt]) {
        e.preventDefault();
        openModal(dt);
        return;
      }

      // Handle href links to legal pages
      var href = target.getAttribute('href');
      if (href) {
        // Normalize: strip the origin, handle relative paths
        var modalId = URL_MAP[href];
        if (!modalId) {
          // Try to match by pathname ending
          try {
            var url = new URL(href, window.location.href);
            var path = url.pathname;
            if (path.indexOf('/impressum') !== -1) modalId = 'modal-impressum';
            else if (path.indexOf('/datenschutz') !== -1) modalId = 'modal-datenschutz';
            else if (path.indexOf('/haftung') !== -1) modalId = 'modal-haftung';
          } catch (_) {}
        }
        if (modalId && overlays[modalId]) {
          e.preventDefault();
          openModal(modalId);
        }
      }
    });

    // ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* ───── boot ───── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
