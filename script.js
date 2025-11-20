(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

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
              // ✅ móvil hasta 768px
              breakpoint: 768,
              settings: {
                item: mobileItems,     // .slider-h -> 1  |  .slider-v -> 2
                slideMove: 1,
                slideMargin: 12
              }
            }
          ]
        });
      }
    }

    // ✅ horizontales: 3 escritorio / 1 móvil
    initSlider('.slider-h', 3, 1);

    // ✅ verticales: 4 escritorio / 2 móvil
    initSlider('.slider-v', 4, 2);
  });
})();

