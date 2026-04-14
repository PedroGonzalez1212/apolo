/* ============================================================
  APOLO PRODUCCIONES — main.js
============================================================ */


/* ============================================================
  NAVBAR — scroll transparente → sólido
============================================================ */

const nav        = document.getElementById('mainNav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });
}

if (hamburger && mobileMenu) {

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) mobileMenu.querySelector('a')?.focus();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Cerrar menú con Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

}


/* ============================================================
  BARRA DE PROGRESO DE SCROLL
============================================================ */

const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.setAttribute('role', 'progressbar');
progressBar.setAttribute('aria-hidden', 'true');
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ============================================================
  CURSOR PERSONALIZADO
  Con requestAnimationFrame para mayor fluidez en 120Hz+
============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouchDevice) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  let rafPending = false;

  function updateCursor() {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    rafPending = false;
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateCursor);
    }
  });

  const interactives = 'a, button, .btn-primary, .btn-ghost, .nav__cta';

  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
}


/* ============================================================
  REVEAL AL SCROLL — fade + slide up
============================================================ */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
  CONTADOR ANIMADO EN STATS
============================================================ */

function animateCount(el, target, duration = 1400) {
  /* Respetar prefers-reduced-motion: mostrar número final sin animación */
  if (prefersReducedMotion) {
    el.textContent = target % 1 !== 0
      ? target.toFixed(1)
      : target.toLocaleString('es-AR');
    return;
  }

  const start     = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = eased * target;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-AR');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal
        ? target.toFixed(1)
        : target.toLocaleString('es-AR');
    }
  }

  requestAnimationFrame(update);
}

const statEls = document.querySelectorAll('[data-count]');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseFloat(entry.target.dataset.count);
      const prefix = entry.target.dataset.prefix || '';
      const suffix = entry.target.dataset.suffix || '';

      let numSpan = entry.target.querySelector('.count-num');
      if (!numSpan) {
        entry.target.textContent = '';
        numSpan = document.createElement('span');
        numSpan.className = 'count-num';
        entry.target.appendChild(numSpan);
        if (prefix) entry.target.insertAdjacentText('afterbegin', prefix);
        if (suffix) entry.target.insertAdjacentText('beforeend', suffix);
      }

      animateCount(numSpan, target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statEls.forEach(el => statObserver.observe(el));

/* ============================================================
  GALERÍA — VER MÁS / VER MENOS
============================================================ */

const galleryBtn = document.getElementById('galleryBtn');
const extraItems = document.querySelectorAll('.gallery__item--extra');

if (galleryBtn) {
  galleryBtn.addEventListener('click', () => {
    const isOpen = galleryBtn.getAttribute('aria-expanded') === 'true';

    extraItems.forEach(item => {
      item.classList.toggle('is-visible', !isOpen);
    });

    galleryBtn.textContent = isOpen ? 'Ver más' : 'Ver menos';
    galleryBtn.setAttribute('aria-expanded', String(!isOpen));

    if (isOpen) {
      document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
    }
  });
}