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
})();
