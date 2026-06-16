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
        + '<p>Antje Häuser<br>Eichenstraße 59<br>07549 Gera<br>Deutschland</p>'
        + '<p><strong>Kontakt:</strong><br>'
        + 'E-Mail: <a href="mailto:owner@cloaki.de">owner@cloaki.de</a><br>'
        + 'Tel.: <a href="tel:+4915256958193">+49 1525 6958193</a></p>'
        + '<p><strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br>'
        + 'Antje Häuser<br>Eichenstraße 59<br>07549 Gera</p>'
        + '<p><strong>Projektleitung, Webentwicklung &amp; Creative Direction (Cloak Studio):</strong><br>'
        + 'Sean Paul Häuser</p>'
        + '<p><strong>Hinweis zur Kontaktaufnahme:</strong><br>Für den Versand von Paketen oder physischen Anfragen bitten wir um vorherige '
        + 'Kontaktaufnahme per E-Mail. Die genannte Anschrift dient ausschließlich der Erfüllung der gesetzlichen Impressumspflicht und ist keine '
        + 'Absenderadresse für unaufgeforderte Rücksendungen oder Warenversand.</p>'
        + '<hr style="border:none;border-top:1px solid var(--lm-border,rgba(147,197,253,0.12));margin:24px 0;">'
        + '<h3>Geltungsbereich</h3>'
        + '<p>Dieses Impressum gilt für die Webseiten <strong>cloaki.de</strong> und <strong>cloaki-studio.web.app</strong> sowie '
        + 'für sämtliche offiziellen Onlinepräsenzen des Projekts Cloak Studio, für deren Inhalte die oben genannte Betreiberin die '
        + 'rechtliche Verantwortung übernimmt. Dies umfasst insbesondere:</p>'
        + '<ul style="list-style-position:inside;padding-left:0;">'
        + '<li>unseren TikTok-Kanal</li><li>meinen YouTube-Kanal</li><li>meinen Twitch-Kanal</li>'
        + '<li>unseren Discord-Server</li><li>mein Steam-Profil</li><li>mein Epicgames-Profil</li>'
        + '<li>mein GitHub-Profil</li><li>mein Instagram-Profil</li><li>mein VRChat-Profil</li></ul>'
    },
    'modal-datenschutz': {
      title: 'Datenschutz',
      body: '<h3>Geltungsbereich &amp; Verantwortliche Stelle</h3>'
        + '<p>Diese Datenschutzerklärung gilt für das gesamte Projekt <strong>Cloak Studio</strong>. Dies umfasst die Webseiten '
        + '<strong>https://cloaki.de</strong> und <strong>https://cloaki-studio.web.app</strong> sowie alle offiziell dazugehörigen '
        + 'und im Impressum genannten Profile, Kanäle und den Discord-Server.</p>'
        + '<p>Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die im Impressum namentlich genannte '
        + 'Betreiberin des Onlineangebots.<br>'
        + 'Kontakt: <a href="mailto:owner@cloaki.de">owner@cloaki.de</a></p>'
        + '<h3>Allgemeines &amp; Bereitstellung der Website</h3>'
        + '<p>Der Schutz personenbezogener Daten ist uns ein wichtiges Anliegen. Dieses Onlineangebot wird als privates, '
        + 'hobbybezogenes Projekt betrieben. Es werden beim Aufruf der Webseite grundsätzlich nur technisch notwendige '
        + 'Informationen verarbeitet, die zur stabilen Auslieferung und fehlerfreien Anzeige der Seite erforderlich sind.</p>'
        + '<h3>Hosting &amp; Server-Logfiles</h3>'
        + '<p>Das Hosting dieser Webseite erfolgt über den Dienstleister <strong>Firebase Hosting</strong> (Google LLC). '
        + 'Zur Gewährleistung der IT-Sicherheit und der Stabilität des Dienstes erfasst das System bei jedem Aufruf '
        + 'automatisiert Verbindungsdaten des Nutzers. Dazu gehören:</p>'
        + '<ul><li>IP-Adresse des zugreifenden Endgeräts</li>'
        + '<li>Datum und Uhrzeit des Abrufs</li>'
        + '<li>Übertragene Datenmenge</li>'
        + '<li>Browsertyp, Version und Betriebssystem des Nutzers</li></ul>'
        + '<p>Google verarbeitet diese Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO. Ein potenzieller Datentransfer in '
        + 'Drittstaaten (USA) ist über das EU-US Data Privacy Framework rechtlich abgesichert.</p>'
        + '<h3>Technische Funktionen (LocalStorage &amp; Cookies)</h3>'
        + '<p>Zur Optimierung der Barrierefreiheit und zur Speicherung von Darstellungsoptionen nutzen wir die lokalen '
        + 'Speicherfunktionen des Browsers (LocalStorage und SessionStorage). Hierbei werden Einstellungen wie der gewählte '
        + 'Anzeigemodus (Dark-/Light-Mode), Schriftgrößen-Anpassungen oder Farbfilter lokal auf deinem Endgerät gesichert. '
        + 'Diese Daten sind technisch zwingend erforderlich (Art. 6 Abs. 1 lit. f DSGVO) und werden nicht an Server übertragen '
        + 'oder mit Dritten geteilt.</p>'
        + '<p>Die Webseite hält zudem ein technisches Framework für zukünftige Einwilligungslösungen (Cookie-Banner) vor, '
        + 'falls zu einem späteren Zeitpunkt zustimmungspflichtige Erweiterungen implementiert werden sollten. Aktuell werden '
        + 'keine zustimmungspflichtigen Tracking- oder Marketing-Cookies eingesetzt.</p>'
        + '<h3>Zukünftige Spieleserver-Projekte</h3>'
        + '<p>Sollten im Rahmen der Community zu einem späteren Zeitpunkt wieder temporäre Spieleserver gestartet werden, '
        + 'erfolgt deren Bereitstellung über externe Server-Anbieter. Zur Aufrechterhaltung der Serverstabilität verarbeitet '
        + 'der jeweilige Hoster beim Verbindungsaufbau die IP-Adressen der Spieler. Derzeit sind keine solchen Server-Projekte '
        + 'aktiv; es findet keine diesbezügliche Datenerhebung, Speicherung oder Backup-Erstellung statt.</p>'
        + '<h3>E-Mail-Kontakt, Routing &amp; KI-Verarbeitung</h3>'
        + '<p>Wenn du uns per E-Mail kontaktierst, werden deine Angaben (Name, E-Mail-Adresse sowie der Inhalt deiner '
        + 'Nachricht) zur Bearbeitung deines Anliegens verarbeitet.</p>'
        + '<p><strong>Technischer Ablauf &amp; Infrastruktur:</strong> Die auf der Webseite angegebene E-Mail-Adresse nutzt '
        + 'einen E-Mail-Routing-Dienst (Cloudflare), der eingehende Nachrichten an ein zentrales, privates Postfach weiterleitet. '
        + 'Die eigentliche Speicherung, Verwaltung und der Versand von Antworten erfolgen über die Server von Google (Google LLC). '
        + 'Zur effizienten Organisation und Auswertung des Postfachs (z. B. für automatisierte Zusammenfassungen von E-Mails) '
        + 'greifen wir auf integrierte KI-Assistenzfunktionen von Google zurück, welche die eingehenden Texte systemintern verarbeiten.</p>'
        + '<p><strong>Speicherdauer &amp; Löschfristen:</strong></p>'
        + '<ul><li><strong>Allgemeine Anfragen:</strong> E-Mails und Konversationen werden für mindestens 30 Tage gespeichert, '
        + 'um Rückfragen klären zu können.</li>'
        + '<li><strong>Rechnungen &amp; Verträge:</strong> Steuer- und geschäftsrelevante Dokumente werden dauerhaft bzw. '
        + 'entsprechend der gesetzlichen Aufbewahrungsfristen (bis zu 10 Jahre) archiviert.</li>'
        + '<li><strong>Werbung &amp; Spam:</strong> Unerwünschte Werbemails, Newsletter oder Spam-Nachrichten werden in der '
        + 'Regel innerhalb einer Woche routinemäßig gelöscht.</li></ul>'
        + '<p><strong>Stand:</strong> Juni 2026</p>'
    },
    'modal-haftung': {
      title: 'Haftungsausschluss',
      body: '<h3>Geltungsbereich</h3>'
        + '<p>Dieser Haftungsausschluss gilt für die Webseiten <strong>https://cloaki.de</strong> und '
        + '<strong>https://cloaki-studio.web.app</strong> sowie für alle offiziell angebundenen Profile des Projekts '
        + 'Cloak Studio (inkl. TikTok, YouTube, Twitch und Discord).</p>'
        + '<h3>Privater Charakter &amp; Unterstützung</h3>'
        + '<p>Dieses Onlineangebot wird als privates, hobbybezogenes Projekt betrieben. Freiwillige Zuwendungen (Spenden) '
        + 'über Plattformen wie <strong>Ko-fi</strong> dienen ausschließlich der Mitfinanzierung und Deckung der laufenden '
        + 'Server-, Software- und Hardwarekosten der Community.</p>'
        + '<h3>Haftung für publizierte Inhalte &amp; Verweise</h3>'
        + '<p>Die redaktionelle und rechtliche Verantwortung für alle publizierten Inhalte (einschließlich Videos, Livestreams, '
        + 'Grafiken und Textbeiträgen auf dieser Website sowie auf den angebundenen Drittplattformen) liegt vollumfänglich bei '
        + 'der im Impressum genannten Inhaberin und Betreiberin des Projekts. Die Inhalte wurden mit größter Sorgfalt erstellt; '
        + 'für die dauerhafte Richtigkeit, Vollständigkeit und Aktualität kann jedoch keine Gewähr übernommen werden.</p>'
        + '<p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die '
        + 'Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. <strong>Das Anklicken '
        + 'und Nutzen dieser externen Links erfolgt ausdrücklich auf eigene Gefahr.</strong></p>'
        + '<h3>Discord, Sprachkanäle &amp; Aufnahmen</h3>'
        + '<ul><li>Die Nutzung unseres Discord-Servers sowie die Teilnahme an zukünftigen Spieleprojekten ist vollkommen freiwillig.</li>'
        + '<li><strong>Audio-Aufzeichnungen &amp; Zutrittsverbot:</strong> Wer sich in den öffentlichen Sprachkanälen unseres '
        + 'Discords oder innerhalb zukünftiger In-Game-Sprachsysteme (z. B. SimpleVoiceChat) aufhält, erklärt sich ausdrücklich '
        + 'damit einverstanden, dass die eigene Stimme in Audio- oder Videoaufzeichnungen (z. B. Livestreams, YouTube-Videos) von '
        + 'Content Creatoren der Community zu hören sein kann. Da das Mindestalter für diese rechtsgültige Einwilligung 16 Jahre '
        + 'beträgt, ist <strong>Nutzern unter 16 Jahren die aktive Teilnahme an diesen Sprachkanälen (sowohl auf dem Discord-Server '
        + 'als auch in In-Game-Systemen) ausdrücklich verboten</strong>.</li>'
        + '<li>Sämtliche Moderationsmaßnahmen sowie die Freischaltung für geschlossene Kanäle liegen im freien Ermessen der '
        + 'Projektleitung. Es besteht kein Anspruch auf permanenten Zugang.</li></ul>'
        + '<h3>Urheberrecht &amp; Geistiges Eigentum (Copyright Claim)</h3>'
        + '<p><strong>Alle Rechte vorbehalten.</strong> Die durch die Projektleitung (Sean Paul Häuser) erstellten Werke und '
        + 'Inhalte auf dieser Website unterliegen dem deutschen Urheberrecht. Dies umfasst ausdrücklich und vollumfänglich:</p>'
        + '<ul><li>Das eigenständige Frontend-Design (UI/UX) und das individuelle visuelle Layout.</li>'
        + '<li>Den selbst geschriebenen HTML-, CSS- und JavaScript-Quellcode.</li>'
        + '<li>Die konzeptionelle Idee, die Struktur und den Aufbau der Website (Cloak Studio).</li>'
        + '<li>Sämtliche selbst erstellten Grafiken, Avatare, Logos und Texte.</li></ul>'
        + '<p><strong>Ausgenommen hiervon sind Lizenzen Dritter:</strong> Eingebundene Open-Source-Ressourcen, externe '
        + 'Code-Bibliotheken (z. B. Material Web Components, Lit) sowie lokal gehostete Schriftarten (z. B. Google Fonts, '
        + 'Material Icons) verbleiben im geistigen Eigentum ihrer jeweiligen Urheber und werden unter den entsprechenden '
        + 'Open-Source-Lizenzen (wie Apache 2.0, MIT oder SIL Open Font License) verwendet.</p>'
        + '<p>Jede Art der Vervielfältigung, Bearbeitung, Verbreitung, das Kopieren von eigenen Code-Snippets oder '
        + 'Design-Elementen (auch in abgewandelter Form) sowie jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes '
        + 'bedürfen der vorherigen, ausdrücklichen und schriftlichen Zustimmung der Projektleitung. Unerlaubte Kopien oder das '
        + 'Klonen der Website werden rechtlich verfolgt.</p>'
        + '<p><strong>Stand:</strong> Juni 2026</p>'
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
    // Clear hash without triggering scroll or reload
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
    }
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
        window.location.hash = dt.replace('modal-', '');
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
          } catch (_) { }
        }
        if (modalId && overlays[modalId]) {
          e.preventDefault();
          window.location.hash = modalId.replace('modal-', '');
          openModal(modalId);
        }
      }
    });

    // ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    // Check hash on load
    var hash = window.location.hash.toLowerCase();
    var hashModalId;
    if (hash === '#impressum' || hash === '#modal-impressum') hashModalId = 'modal-impressum';
    else if (hash === '#datenschutz' || hash === '#modal-datenschutz') hashModalId = 'modal-datenschutz';
    else if (hash === '#haftung' || hash === '#haftungsausschluss' || hash === '#modal-haftung') hashModalId = 'modal-haftung';

    if (hashModalId && overlays[hashModalId]) {
      // Delay opening slightly to ensure CSS transitions can run after DOM insertion
      setTimeout(function () {
        openModal(hashModalId);
      }, 50);
    }
  }

  /* ───── boot ───── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
