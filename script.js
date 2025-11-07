(function () {
  'use strict';

  // Al cargar la página, actualizamos currentPage y prevPage en sessionStorage.
  document.addEventListener('DOMContentLoaded', function () {
    var current = location.href;
    var storedCurrent = sessionStorage.getItem('currentPage') || '';
    var ref = document.referrer || '';

    // Si había una página marcada como current y es distinta a la actual, convertirla en prevPage
    if (storedCurrent && storedCurrent !== current) {
      sessionStorage.setItem('prevPage', storedCurrent);
    } else if (!storedCurrent && ref && ref !== current) {
      // si no había current y hay referrer distinto, use ref como prevPage
      sessionStorage.setItem('prevPage', ref);
    }

    // Guardar la página actual como currentPage
    sessionStorage.setItem('currentPage', current);

    // Función que resuelve la mejor URL de retorno
    function resolveBackUrl() {
      var prev = sessionStorage.getItem('prevPage') || '';
      // Preferir prevPage si existe y es del mismo origen (evita saltos a dominios externos)
      try {
        if (prev) {
          var p = new URL(prev, location.href);
          if (p.origin === location.origin) return prev;
        }
      } catch (e) { /* ignore malformed */ }

      // Si no hay prevPage o es externa, usar document.referrer si es del mismo origen
      if (ref) {
        try {
          var r = new URL(ref, location.href);
          if (r.origin === location.origin) return ref;
        } catch (e) {}
      }

      // Finalmente, indicar que use history.back()
      return null;
    }

    var backUrl = resolveBackUrl();

    // Seleccionar enlaces a modificar:
    // - anchors con class="back-link"
    // - anchors con data-back="last"
    // - anchors cuyo texto incluye 'volver' (insensible a mayúsculas) o flecha ← / <- 
    // - (opcional) anchors que apuntan a index.html
    var anchors = Array.prototype.slice.call(document.querySelectorAll('a'));
    anchors.forEach(function (a) {
      var text = (a.textContent || '').toLowerCase();
      var href = a.getAttribute('href') || '';
      var isVolverText = text.indexOf('volver') !== -1 || text.indexOf('←') !== -1 || text.indexOf('<-') !== -1;
      var isIndexLink = href && href.replace(/[#?].*$/,'').toLowerCase().endsWith('index.html');
      var wantsBack = a.classList.contains('back-link') || a.getAttribute('data-back') === 'last' || isVolverText || isIndexLink;

      if (!wantsBack) return;

      // Cambiar comportamiento: si hay URL resuelta, actualizar href; si no, usar history.back()
      if (backUrl) {
        a.setAttribute('href', backUrl);
        // accesibilidad: indicar que este enlace vuelve a la página previa
        a.setAttribute('aria-label', a.getAttribute('aria-label') || 'Volver a la página anterior');
      } else {
        // Evitar navegación a index.html por defecto: interceptar click y usar history.back()
        a.addEventListener('click', function (ev) {
          ev.preventDefault();
          // Si history length es suficiente, navegamos atrás; si no, como fallback ir a index.html
          if (window.history && window.history.length > 1) {
            window.history.back();
            // small timeout para guardado de sessionStorage en otras páginas
            return;
          }
          // Fallback: si no hay historial navegable, enviar a la home segura (index.html)
          location.href = 'index.html';
        }, { passive: false });
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', a.getAttribute('aria-label') || 'Volver');
        // también eliminar href engañoso que apuntaba a index.html para evitar confusión en hover
        // (solo si apuntaba a index.html)
        if (isIndexLink) a.removeAttribute('href');
      }
    });
  });
})();