/**
 * Intelligence Designed To Evolve
 * Vanilla JavaScript interactions & counter animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStatsCounter();
  initMobileMenu();
  initNavLinks();
});

/**
 * 1) Count-up stats animation using easeOutCubic
 * duration: 1500 + i * 80ms
 * start offset: 480 + i * 90ms
 * IntersectionObserver threshold: 0.25 (triggered once)
 */
function initStatsCounter() {
  const statCards = document.querySelectorAll('.stat-card');
  const statsFooter = document.getElementById('stats');
  if (!statCards.length || !statsFooter) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ease Out Cubic function
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function startCountUp() {
    statCards.forEach((card, index) => {
      const valueEl = card.querySelector('.stat-value');
      if (!valueEl) return;

      const target = parseFloat(card.dataset.target || '0');
      const suffix = card.dataset.suffix || '';
      const decimals = parseInt(card.dataset.decimals || '0', 10);
      const duration = 1500 + index * 80;
      const startOffset = 480 + index * 90;

      if (prefersReducedMotion) {
        valueEl.textContent = target.toFixed(decimals) + suffix;
        return;
      }

      setTimeout(() => {
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);
          const current = eased * target;

          valueEl.textContent = current.toFixed(decimals) + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            valueEl.textContent = target.toFixed(decimals) + suffix;
          }
        }

        requestAnimationFrame(step);
      }, startOffset);
    });
  }

  // Observe once with threshold 0.25
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCountUp();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(statsFooter);
}

/**
 * 2) Mobile Navigation & Sheet Overlay
 * - Burger toggle aria-expanded
 * - Overlay hidden toggle
 * - body.menu-open
 * - Close on overlay click, Escape key, link click, or resize > 720px
 */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const sheet = document.getElementById('mobile-sheet');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sign-in');

  if (!burgerBtn || !overlay) return;

  function openMenu() {
    burgerBtn.setAttribute('aria-expanded', 'true');
    overlay.removeAttribute('hidden');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    burgerBtn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking overlay backdrop outside sheet
  overlay.addEventListener('click', (e) => {
    if (sheet && !sheet.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Close when clicking any menu link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on resize > 720px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && burgerBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/**
 * 3) Navigation active item handler
 */
function initNavLinks() {
  const desktopLinks = document.querySelectorAll('.nav-link');
  desktopLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      desktopLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      mobileNavLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
