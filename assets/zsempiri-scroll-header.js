/* ============================================================
   ZSEMPIRI — Scroll-aware header
   Lefele görgetésnél eltűnik, felfelé görgetésnél visszajön.
   ============================================================ */
(function () {
  'use strict';

  const header = document.querySelector('.shopify-section-header');
  if (!header) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;

    if (y > lastY && y > 120) {
      // Lefele görgetés + már elgördültünk a header magasságán túl
      header.classList.add('zsempiri-header--hidden');
    } else {
      // Felfelé görgetés VAGY az oldal tetején vagyunk
      header.classList.remove('zsempiri-header--hidden');
    }

    lastY = Math.max(0, y);
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
})();
