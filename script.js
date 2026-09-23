/* ═══════════════════════════════════════════════════════
   تیم کوشان — اسکریپت اصلی
   تمام افکتها با Vanilla JS و بدون هیچ کتابخانه
   کارتهای تیم و نمونهکارها از data.js رندر میشوند
   ═══════════════════════════════════════════════════════ */

'use strict';

/* تشخیص حالت کاهش حرکت */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══ آیکونهای SVG مشترک برای رندر کارتها ═══ */
const ICON_GITHUB = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.89-.39.98.01 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>';
const ICON_LINKEDIN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>';
const ICON_IMAGE = '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
const ICON_ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

/* ═══ رندر کارتهای تیم از data.js ═══ */
function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  MEMBERS.forEach((m) => {
    const card = document.createElement('article');
    card.className = 'team-card reveal';
    card.setAttribute('data-tilt', '');

    /* آواتار: عکس واقعی یا حروف اول گرادیانی */
    const avatar = m.photo
      ? `<img src="${m.photo}" alt="${m.name}" class="avatar-img">`
      : `<div class="avatar" data-avatar>${m.initials}</div>`;

    /* مهارتها */
    const skills = m.skills.map((s) => `<li>${s}</li>`).join('');

    /* دکمه مشاهده پروفایل کامل */
    const profileBtn = `
      <a href="member.html?id=${m.id}" class="btn btn-outline btn-sm team-profile-btn">
        مشاهده پروفایل
        ${ICON_ARROW}
      </a>`;

    card.innerHTML = `
      <span class="team-card-glow" aria-hidden="true"></span>
      <div class="avatar-wrap">${avatar}</div>
      <h3 class="team-name">${m.name}</h3>
      <p class="team-role">${m.role}</p>
      <p class="team-bio">${m.bio}</p>
      <ul class="team-skills">${skills}</ul>
      <div class="team-socials">
        <a href="${m.github}" class="social-icon" aria-label="گیتهاب ${m.name}" target="_blank" rel="noopener">${ICON_GITHUB}</a>
        <a href="${m.linkedin}" class="social-icon" aria-label="لینکدین ${m.name}" target="_blank" rel="noopener">${ICON_LINKEDIN}</a>
      </div>
      ${profileBtn}`;
    grid.appendChild(card);
  });
}

/* ═══ رندر کارتهای نمونهکار از data.js ═══ */
function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  PROJECTS.forEach((p) => {
    const item = document.createElement('article');
    item.className = 'portfolio-item reveal';
    item.setAttribute('data-category', p.category);
    item.setAttribute('data-id', p.id);

    /* تصویر: عکس واقعی یا placeholder گرادیانی */
    const thumbImg = p.images && p.images[0]
      ? `<img src="${p.images[0]}" alt="${p.title}">`
      : ICON_IMAGE;

    item.innerHTML = `
      <div class="portfolio-thumb thumb-grad-${p.thumbGrad}">
        ${thumbImg}
        <span class="portfolio-tag">${p.tagLabel}</span>
      </div>
      <div class="portfolio-body">
        <h3 class="portfolio-title">${p.title}</h3>
        <p class="portfolio-desc">${p.desc}</p>
      </div>`;

    /* کلیک روی کارت → صفحه جزئیات پروژه */
    item.addEventListener('click', () => {
      location.href = `project.html?id=${p.id}`;
    });
    grid.appendChild(item);
  });
}

/* ═══ 1 و 2) اسکرول ریویل با تأخیر پلهای (Stagger) ═══ */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // اعمال تأخیر پلهای بهصورت موقت (بعد از پایان انیمیشن پاک میشود
        // تا با ترنزیشنهای هاور تداخل نکند)
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        if (delay > 0) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('visible');
        setTimeout(() => { el.style.transitionDelay = ''; }, delay + 800);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
}

/* تأخیر پلهای برای کارتها و آیتمهای لیستی */
function initStagger() {
  const groups = document.querySelectorAll('.team-grid, .portfolio-grid, .stats-grid, .hero-actions, .contact-cards');
  groups.forEach((group) => {
    [...group.children].forEach((child, i) => {
      const el = child.classList.contains('reveal') ? child : child.querySelector('.reveal');
      if (el) el.dataset.revealDelay = String(i * 90);
    });
  });
}

/* ═══ 3) افکت سهبعدی Tilt روی کارتها ═══ */
function initTilt() {
  if (prefersReducedMotion) return;
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((card) => {
    const MAX = 8; // حداکثر زاویه چرخش

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // بازتاب نور داخل کارت
      card.style.setProperty('--shine-x', `${x * 100}%`);
      card.style.setProperty('--shine-y', `${y * 100}%`);
      // چرخش سهبعدی ملایم
      const rotY = (x - 0.5) * 2 * MAX;
      const rotX = (0.5 - y) * 2 * MAX;
      card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ═══ 4) شمارنده اعداد بخش آمار ═══ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  // تبدیل عدد به ارقام فارسی
  const toFa = (num) => String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = prefix + toFa(target) + suffix;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easing نرم برای شمارش
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + toFa(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* ═══ 5) نوارهای پیشرفت مهارتها ═══ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const fill = (bar) => { bar.style.width = `${bar.dataset.percent}%`; };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fill);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fill(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((bar) => io.observe(bar));
}

/* ═══ 6) تایپینگ متن زیرعنوان هیرو ═══ */
function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const text = 'طراحی وب سایت و سامانه اختصاصی و مدرن';
  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }
  let i = 0;
  const type = () => {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(type, 55);
  };
  type();
}

/* ═══ 7) گرادیان متحرک عنوانها ═══
   فقط با CSS انجام میشود (کلاس gradient-text-anim) */

/* ═══ 8) هاله نور دنبالکننده موس ═══ */
function initGlow() {
  const glow = document.getElementById('bgGlow');
  if (!glow || prefersReducedMotion) return;

  let targetX = window.innerWidth * 0.7;
  let targetY = window.innerHeight * 0.35;
  let curX = targetX;
  let curY = targetY;
  let rafId = null;

  // موقعیت اولیه هاله قبل از اولین حرکت موس
  glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;

  const loop = () => {
    // حرکت نرم (lerp) برای دنبال کردن موس
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  };

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }, { passive: true });
}

/* ═══ 9) منوی موبایل ═══ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const close = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // بستن منو با کلیک روی لینک
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  // بستن با کلیک بیرون منو
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      close();
    }
  });
}

/* ═══ هایلایت آیتم فعال منو بر اساس بخش قابل مشاهده ═══ */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-link[data-section]');
  if (!links.length) return;
  const sections = [...links].map((l) => document.getElementById(l.dataset.section)).filter(Boolean);

  const setActive = (id) => {
    links.forEach((l) => l.classList.toggle('active', l.dataset.section === id));
  };

  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));
}

/* ═══ شفاف به شیشهای شدن منو پس از اسکرول ═══ */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══ 10) پارالاکس ملایم هیرو ═══ */
function initParallax() {
  if (prefersReducedMotion) return;
  const heroContent = document.querySelector('.hero-content');
  const particles = document.getElementById('particles');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = String(1 - y / (window.innerHeight * 1.1));
      if (particles) particles.style.transform = `translateY(${y * 0.12}px)`;
    }
  }, { passive: true });
}

/* ═══ 11) ذرات شناور آرام در هیرو (Canvas) ═══ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  let rafId = null;

  const COLORS = ['rgba(99, 102, 241,', 'rgba(34, 211, 238,', 'rgba(168, 85, 247,'];

  const resize = () => {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  };

  const create = () => {
    const count = Math.min(45, Math.floor(canvas.width / 30));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.15,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      // چرخش از لبهها
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${p.alpha})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  resize();
  create();
  draw();

  // فقط وقتی هیرو در دید است انیمیت شود
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && rafId === null) {
          draw();
        } else if (!entry.isIntersecting && rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 });
    io.observe(canvas);
  }

  window.addEventListener('resize', () => { resize(); create(); });
}

/* ═══ 13) فیلتر نمونهکارها با انیمیشن ═══ */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      let shown = 0;
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          // ظاهر شدن با تأخیر پلهای (فقط بر اساس ترتیب آیتمهای نمایشی)
          const delay = shown * 60;
          shown++;
          item.style.transitionDelay = `${delay}ms`;
          item.classList.remove('is-hidden');
          // پاک کردن تأخیر پس از انیمیشن تا هاور کند نشود
          setTimeout(() => { item.style.transitionDelay = ''; }, delay + 600);
        } else {
          item.style.transitionDelay = '0ms';
          item.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ═══ راهاندازی ═══ */
document.addEventListener('DOMContentLoaded', () => {
  /* رندر کارتهای داینامیک از data.js (قبل از ریویل و تیلت) */
  renderTeam();
  renderPortfolio();

  initStagger();
  initReveal();
  initTilt();
  initCounters();
  initSkillBars();
  initTyping();
  initGlow();
  initMobileNav();
  initActiveNav();
  initNavScroll();
  initParallax();
  initParticles();
  initPortfolioFilter();
});
