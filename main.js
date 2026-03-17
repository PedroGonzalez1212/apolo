
/* ============================================================
  APOLO PRODUCCIONES — main.js
============================================================ */


/* ============================================================
  NAVBAR — scroll transparente → sólido
============================================================ */

const nav        = document.getElementById('mainNav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 50);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});


/* ============================================================
  BARRA DE PROGRESO DE SCROLL
============================================================ */

const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ============================================================
  CURSOR PERSONALIZADO
============================================================ */

const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

let mouseX = -100, mouseY = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

/* Agrandar al pasar sobre interactivos */
const interactives = 'a, button, .btn-primary, .btn-ghost, .nav__cta';

document.querySelectorAll(interactives).forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
});

/* Ocultar cuando el mouse sale de la ventana */
document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));


/* ============================================================
  REVEAL AL SCROLL — fade + slide up
  Agregar clase .reveal a cualquier elemento para animarlo
============================================================ */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target); /* animar solo una vez */
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
  CONTADOR ANIMADO EN STATS
  Busca elementos con data-count="número"
============================================================ */

function animateCount(el, target, duration = 1400) {
  const start     = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* ease out quart */
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = eased * target;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-AR');

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target % 1 !== 0
      ? target.toFixed(1)
      : target.toLocaleString('es-AR');
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

      /* Wrapeamos el número en un span para no pisar prefix/suffix */
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