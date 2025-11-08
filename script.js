(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // ========== BACK LINK ==========
    var current = location.href;
    var storedCurrent = sessionStorage.getItem('currentPage') || '';
    var ref = document.referrer || '';

    if (storedCurrent && storedCurrent !== current) {
      sessionStorage.setItem('prevPage', storedCurrent);
    } else if (!storedCurrent && ref && ref !== current) {
      sessionStorage.setItem('prevPage', ref);
    }
    sessionStorage.setItem('currentPage', current);

    function resolveBackUrl() {
      var prev = sessionStorage.getItem('prevPage') || '';
      try {
        if (prev) {
          var p = new URL(prev, location.href);
          if (p.origin === location.origin) return prev;
        }
      } catch (e) {}
      if (ref) {
        try {
          var r = new URL(ref, location.href);
          if (r.origin === location.origin) return ref;
        } catch (e) {}
      }
      return null;
    }

    var backUrl = resolveBackUrl();
    var anchors = Array.prototype.slice.call(document.querySelectorAll('a'));
    anchors.forEach(function (a) {
      var text = (a.textContent || '').toLowerCase();
      var href = a.getAttribute('href') || '';
      var isVolverText = text.includes('volver') || text.includes('←') || text.includes('<-');
      var isIndexLink = href && href.replace(/[#?].*$/, '').toLowerCase().endsWith('index.html');
      var wantsBack = a.classList.contains('back-link') || a.getAttribute('data-back') === 'last' || isVolverText || isIndexLink;

      if (!wantsBack) return;

      if (backUrl) {
        a.setAttribute('href', backUrl);
        a.setAttribute('aria-label', a.getAttribute('aria-label') || 'Volver a la página anterior');
      } else {
        a.addEventListener('click', function (ev) {
          ev.preventDefault();
          if (window.history && window.history.length > 1) {
            window.history.back();
            return;
          }
          location.href = 'index.html';
        }, { passive: false });
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', a.getAttribute('aria-label') || 'Volver');
        if (isIndexLink) a.removeAttribute('href');
      }
    });

    // ========== SLIDERS LIGHTSLIDER ==========
    function initSlider(selector, desktopItems, mobileItems) {
      var $el = $(selector);
      if ($el.length) {
        $el.lightSlider({
          item: desktopItems,
          slideMove: 1,
          slideMargin: 28,
          loop: false,
          pager: false,
          controls: true,
          responsive: [
            {
              breakpoint: 600,
              settings: {
                item: mobileItems,
                slideMove: 1,
                slideMargin: 12
              }
            }
          ]
        });
      }
    }

    // Galerías horizontales: 3 en desktop, 1 en móvil
    initSlider('.slider-h', 3, 1);

    // Galerías verticales: 4 en desktop, 2 en móvil
    initSlider('.slider-v', 4, 2);
  });
})();

