/* ============================================
   GOLF CLUB DU FOREZ — main.js
   ============================================ */

// --- Navigation scroll effect ---
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
      nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('scrolled');
      if (nav.dataset.transparent === 'true') {
        nav.classList.add('nav--transparent');
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Mobile hamburger ---
const burger = document.querySelector('.nav-burger');
const mobileNav = document.querySelector('.nav-mobile');
const burgerSpans = burger?.querySelectorAll('span');

if (burger && mobileNav) {
  let open = false;
  burger.addEventListener('click', () => {
    open = !open;
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (burgerSpans) {
      if (open) {
        burgerSpans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        burgerSpans[1].style.opacity = '0';
        burgerSpans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        burgerSpans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      burgerSpans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// --- Scroll reveal ---
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  reveals.forEach(el => observer.observe(el));
}

// --- Calendar filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const calendarEvents = document.querySelectorAll('.calendar-event');

if (filterBtns.length && calendarEvents.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      calendarEvents.forEach(ev => {
        if (filter === 'all' || ev.dataset.type === filter) {
          ev.style.display = '';
        } else {
          ev.style.display = 'none';
        }
      });
      // Show/hide month headers
      document.querySelectorAll('.month-group').forEach(group => {
        const visible = Array.from(group.querySelectorAll('.calendar-event'))
          .some(e => e.style.display !== 'none');
        group.style.display = visible ? '' : 'none';
      });
    });
  });
}

// --- Animated counters (hero stats) ---
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); counterObserver.unobserve(e.target); }
    }),
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));
}

// --- Active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href === currentPage) link.classList.add('active');
});

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      window.scrollTo({ top: target.offsetTop - offset - 8, behavior: 'smooth' });
    }
  });
});
