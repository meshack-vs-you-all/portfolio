/* ─── Custom Cursor ───────────────────────────────── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
});

function lerp(a, b, n) { return (1 - n) * a + n * b; }
(function lerpLoop() {
  rx = lerp(rx, mx, 0.1);
  ry = lerp(ry, my, 0.1);
  if (ring) ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
  requestAnimationFrame(lerpLoop);
})();

document.querySelectorAll('a, button, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('link-hover'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('link-hover'));
});
document.querySelectorAll('p, h1, h2, h3, .sub, .about-intro-text').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('text-hover'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('text-hover'));
});

/* ─── Page Transitions ────────────────────────────── */
const curtain = document.getElementById('curtain');

function revealPage() {
  if (!curtain) return;
  gsap.fromTo(curtain,
    { scaleY: 1, transformOrigin: 'top' },
    { scaleY: 0, duration: 0.65, ease: 'power3.out', delay: 0.05, onComplete: () => { curtain.style.transform = ''; curtain.style.transformOrigin = ''; } }
  );
}

function exitPage(href) {
  if (!curtain) return;
  gsap.fromTo(curtain,
    { scaleY: 0, transformOrigin: 'bottom' },
    { scaleY: 1, duration: 0.45, ease: 'power3.in', onComplete: () => { window.location.href = href; } }
  );
}

window.addEventListener('DOMContentLoaded', revealPage);

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('//')) return;
  link.addEventListener('click', e => { e.preventDefault(); exitPage(href); });
});

/* ─── Active Nav Link ─────────────────────────────── */
(function setActive() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const h = a.getAttribute('href');
    if ((page === '' || page === 'index.html') && (h === 'index.html' || h === './')) a.classList.add('active');
    else if (h === page) a.classList.add('active');
  });
})();

/* ─── Nav scroll ─────────────────────────────────── */
const nav = document.querySelector('nav');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
  scrollTopBtn?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

/* ─── Mobile nav ─────────────────────────────────── */
window.toggleMobileNav = function() {
  document.getElementById('mobileNav')?.classList.toggle('open');
};
window.closeMobileNav = function() {
  document.getElementById('mobileNav')?.classList.remove('open');
};

/* ─── GSAP Scroll Reveals ─────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    });
  });

  // Stagger groups
  gsap.utils.toArray('.stagger-group').forEach(group => {
    const children = group.querySelectorAll('.stagger-item');
    gsap.to(children, {
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      opacity: 1, y: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
    });
    children.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(30px)'; });
  });

  // Chips stagger
  document.querySelectorAll('.chips').forEach(chips => {
    const c = chips.querySelectorAll('.chip');
    gsap.set(c, { opacity: 0, y: 16, scale: 0.88 });
    gsap.to(c, {
      scrollTrigger: { trigger: chips, start: 'top 90%', once: true },
      opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.4, ease: 'back.out(1.3)'
    });
  });

  // Work rows / project items
  gsap.utils.toArray('.work-row, .proj-item').forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      opacity: 0, x: -20, duration: 0.6, ease: 'power3.out', delay: i * 0.04
    });
  });

  // Terminal lines
  const tLines = document.querySelectorAll('.term-body > *');
  if (tLines.length) {
    gsap.from(tLines, {
      scrollTrigger: { trigger: '.terminal-wrap', start: 'top 78%', once: true },
      opacity: 0, x: -10, stagger: 0.055, duration: 0.3, ease: 'power2.out'
    });
  }

  // Stat values count-up
  document.querySelectorAll('.stat-val').forEach(el => {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    const num = parseInt(match[1]);
    const prefix = text.split(match[1])[0].replace(/[0-9]/g,'');
    const suffix = text.split(match[1])[1] || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to({ v: 0 }, { v: num, duration: 1.5, ease: 'power2.out',
        onUpdate: function() { el.innerHTML = prefix + Math.round(this.targets()[0].v) + suffix.replace('<span class="acc">', '<span class="acc">'); }
      })
    });
  });
});
