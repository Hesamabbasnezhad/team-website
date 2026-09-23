/* ═══════════════════════════════════════════════════════
   تیم کوشان — منطق صفحات جزئیات (project.html / member.html)
   محتوای صفحه را از data.js بر اساس ?id= در URL پر میکند
   ═══════════════════════════════════════════════════════ */

'use strict';

/* تشخیص نوع صفحه از نام فایل */
const PAGE_TYPE = location.pathname.includes('member') ? 'member' : 'project';

/* گرفتن id از کوئری استرینگ */
const getIdFromUrl = () => new URLSearchParams(location.search).get('id');

/* ساخت آیتم گالری — عکس واقعی یا placeholder گرادیانی */
function buildGalleryItem(imgSrc, gradClass, altText) {
  const item = document.createElement('div');
  item.className = 'detail-gallery-item' + (imgSrc ? '' : ' placeholder ' + gradClass);
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = altText;
    img.loading = 'lazy';
    item.appendChild(img);
  } else {
    // آیکون تصویر placeholder
    item.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
  }
  return item;
}

/* ═══ پر کردن صفحه جزئیات پروژه ═══ */
function renderProjectPage(project) {
  const container = document.querySelector('.container');
  if (!project) {
    container.innerHTML = `
      <div class="detail-notfound">
        <h1>پروژه پیدا نشد</h1>
        <p>متأسفانه پروژهای با این شناسه وجود ندارد.</p>
        <a href="index.html#portfolio" class="btn btn-primary">بازگشت به نمونهکارها</a>
      </div>`;
    return;
  }

  document.title = `${project.title} | تیم کوشان`;
  document.getElementById('breadcrumbTitle').textContent = project.title;
  document.getElementById('detailTag').textContent = project.tagLabel;
  document.getElementById('detailTitle').textContent = project.title;
  document.getElementById('detailDesc').textContent = project.desc;
  document.getElementById('metaYear').textContent = project.year;
  document.getElementById('metaClient').textContent = project.client;
  document.getElementById('metaDuration').textContent = project.duration;

  /* تصویر بزرگ سربرگ */
  const heroThumb = document.getElementById('detailHeroThumb');
  heroThumb.className = `detail-hero-thumb thumb-grad-${project.thumbGrad}`;
  heroThumb.innerHTML = '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
  if (project.images[0]) {
    heroThumb.innerHTML = '';
    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = project.title;
    heroThumb.appendChild(img);
  }

  /* لینک نسخه زنده */
  const liveLink = document.getElementById('detailLiveLink');
  liveLink.href = project.link || '#';
  if (!project.link || project.link === '#') liveLink.style.display = 'none';

  /* گالری تصاویر رزومه */
  const gallery = document.getElementById('detailGallery');
  project.images.forEach((src, i) => {
    const item = buildGalleryItem(src, `thumb-grad-${((project.thumbGrad + i) % 6) + 1}`, `تصویر ${i + 1} پروژه ${project.title}`);
    gallery.appendChild(item);
  });

  /* توضیحات کامل */
  const longDesc = document.getElementById('detailLongDesc');
  project.longDesc.forEach((p) => {
    const el = document.createElement('p');
    el.textContent = p;
    longDesc.appendChild(el);
  });

  /* قابلیتهای اصلی */
  const features = document.getElementById('detailFeatures');
  project.features.forEach((f) => {
    const li = document.createElement('li');
    li.textContent = f;
    features.appendChild(li);
  });

  /* زبانها و تکنولوژیها با نوار درصد */
  const langs = document.getElementById('detailLangs');
  project.langs.forEach((l) => {
    const item = document.createElement('div');
    item.className = 'detail-lang-item';
    item.innerHTML = `
      <div class="skill-head"><span class="skill-name"></span><span class="skill-percent"></span></div>
      <div class="skill-bar"><div class="skill-bar-fill"></div></div>`;
    item.querySelector('.skill-name').textContent = l.name;
    item.querySelector('.skill-percent').textContent = toFa(l.percent) + '٪';
    const fill = item.querySelector('.skill-bar-fill');
    fill.dataset.percent = String(l.percent);
    langs.appendChild(item);
  });

  /* اعضای درگیر در پروژه */
  const teamRow = document.getElementById('detailTeamRow');
  MEMBERS
    .filter((m) => m.projects.includes(project.id))
    .forEach((m) => teamRow.appendChild(buildMemberChip(m)));

  /* پروژههای دیگر */
  const others = PROJECTS.filter((p) => p.id !== project.id).slice(0, 4);
  const projectsRow = document.getElementById('detailProjectsRow');
  others.forEach((p) => projectsRow.appendChild(buildMiniProject(p)));
}

/* ═══ پر کردن صفحه پروفایل عضو ═══ */
function renderMemberPage(member) {
  const container = document.querySelector('.container');
  if (!member) {
    container.innerHTML = `
      <div class="detail-notfound">
        <h1>عضو پیدا نشد</h1>
        <p>متأسفانه عضوی با این شناسه وجود ندارد.</p>
        <a href="index.html#team" class="btn btn-primary">بازگشت به تیم</a>
      </div>`;
    return;
  }

  document.title = `${member.name} | تیم کوشان`;
  document.getElementById('breadcrumbTitle').textContent = member.name;
  document.getElementById('memberRoleTag').textContent = member.role;
  document.getElementById('memberName').textContent = member.name;
  document.getElementById('memberRole').textContent = member.role;

  /* آواتار — عکس واقعی یا حروف اول گرادیانی */
  const avatarWrap = document.getElementById('memberAvatarWrap');
  if (member.photo) {
    const img = document.createElement('img');
    img.src = member.photo;
    img.alt = member.name;
    avatarWrap.appendChild(img);
  } else {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = member.initials;
    avatarWrap.appendChild(avatar);
  }

  /* لینکهای اجتماعی */
  const socials = document.getElementById('memberSocials');
  const socialIconSvg = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.89-.39.98.01 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>';
  const linkedinIconSvg = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>';
  const socialsList = [
    { href: member.github, label: 'گیتهاب', svg: socialIconSvg },
    { href: member.linkedin, label: 'لینکدین', svg: linkedinIconSvg },
  ];
  socialsList.forEach((s) => {
    const a = document.createElement('a');
    a.href = s.href || '#';
    a.className = 'social-icon';
    a.setAttribute('aria-label', `${s.label} ${member.name}`);
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = s.svg;
    socials.appendChild(a);
  });

  /* معرفی کامل */
  const longBio = document.getElementById('memberLongBio');
  member.longBio.forEach((p) => {
    const el = document.createElement('p');
    el.textContent = p;
    longBio.appendChild(el);
  });

  /* مهارتهای تخصصی با نوار درصد */
  const skills = document.getElementById('memberSkills');
  member.detailSkills.forEach((s) => {
    const item = document.createElement('div');
    item.className = 'detail-lang-item';
    item.innerHTML = `
      <div class="skill-head"><span class="skill-name"></span><span class="skill-percent"></span></div>
      <div class="skill-bar"><div class="skill-bar-fill"></div></div>`;
    item.querySelector('.skill-name').textContent = s.name;
    item.querySelector('.skill-percent').textContent = toFa(s.percent) + '٪';
    const fill = item.querySelector('.skill-bar-fill');
    fill.dataset.percent = String(s.percent);
    skills.appendChild(item);
  });

  /* سوابق کاری */
  const exps = document.getElementById('memberExperiences');
  member.experiences.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="member-exp-dot"></span>
      <span class="member-exp-info">
        <span class="member-exp-title"></span>
        <span class="member-exp-place"></span>
      </span>
      <span class="member-exp-period"></span>`;
    li.querySelector('.member-exp-title').textContent = e.title;
    li.querySelector('.member-exp-place').textContent = e.place;
    li.querySelector('.member-exp-period').textContent = e.period;
    exps.appendChild(li);
  });

  /* پروژههای این عضو */
  const projectsRow = document.getElementById('memberProjectsRow');
  member.projects
    .map((id) => getProject(id))
    .filter(Boolean)
    .forEach((p) => projectsRow.appendChild(buildMiniProject(p)));

  /* سایر اعضا */
  const others = MEMBERS.filter((m) => m.id !== member.id);
  const othersRow = document.getElementById('otherMembersRow');
  others.forEach((m) => othersRow.appendChild(buildMemberChip(m)));
}

/* ═══ کامپوننتهای مشترک ═══ */

/* چیپ عضو (برای لیست اعضای پروژه یا سایر اعضا) */
function buildMemberChip(m) {
  const a = document.createElement('a');
  a.href = `member.html?id=${m.id}`;
  a.className = 'member-chip';
  const avatar = m.photo
    ? `<img src="${m.photo}" alt="${m.name}">`
    : `<span>${m.initials}</span>`;
  a.innerHTML = `
    <span class="chip-avatar">${avatar}</span>
    <span class="member-chip-info">
      <span class="member-chip-name"></span>
      <span class="member-chip-role"></span>
      <span class="member-chip-link">
        مشاهده پروفایل
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
      </span>
    </span>`;
  a.querySelector('.member-chip-name').textContent = m.name;
  a.querySelector('.member-chip-role').textContent = m.role;
  return a;
}

function buildMiniProject(p) {
  const a = document.createElement('a');
  a.href = `project.html?id=${p.id}`;
  a.className = 'mini-project';

  const hasImage = Array.isArray(p.images) && p.images[0];
  const thumbClass = hasImage
    ? 'mini-project-thumb'
    : `mini-project-thumb thumb-grad-${p.thumbGrad}`;

  const thumbContent = hasImage
    ? `<img src="${p.images[0]}" alt="${p.title}" loading="lazy" decoding="async"
            onerror="this.parentElement.classList.add('thumb-grad-${p.thumbGrad}'); this.remove();">`
    : `<svg viewBox="0 0 24 24" width="34" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`;

  a.innerHTML = `
    <div class="${thumbClass}">
      ${thumbContent}
    </div>
    <div class="mini-project-body">
      <h4 class="mini-project-title"></h4>
      <p class="mini-project-desc"></p>
      <span class="mini-project-more">
        مشاهده جزئیات
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
      </span>
    </div>`;

  a.querySelector('.mini-project-title').textContent = p.title;
  a.querySelector('.mini-project-desc').textContent = p.desc;

  return a;
}

/* ═══ لایتباکس گالری ═══ */
function initDetailLightbox() {
  const lightbox = document.getElementById('lightbox');
  const thumb = document.getElementById('lightboxThumb');
  if (!lightbox) return;

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightbox.hidden = true; }, 500);
  };

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.detail-gallery-item');
    if (!item) return;
    const img = item.querySelector('img');
    thumb.innerHTML = '';
    if (img) {
      const big = document.createElement('img');
      big.src = img.src;
      big.alt = img.alt;
      thumb.appendChild(big);
    } else {
      // placeholder گرادیانی هم در لایتباکس نمایش داده شود
      const gradClass = [...item.classList].find((c) => c.startsWith('thumb-grad-'));
      thumb.className = 'lightbox-thumb' + (gradClass ? ` ${gradClass}` : '');
    }
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
}

/* ═══ پر کردن نوارهای درصد پس از ورود به دید ═══ */
function initDetailBars() {
  const bars = document.querySelectorAll('.detail-lang-item .skill-bar-fill');
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
  bars.forEach((b) => io.observe(b));
}

/* ═══ راهاندازی صفحه جزئیات ═══ */
document.addEventListener('DOMContentLoaded', () => {
  const id = getIdFromUrl();

  if (PAGE_TYPE === 'project') {
    renderProjectPage(getProject(id));
  } else {
    renderMemberPage(getMember(id));
  }

  initDetailBars();
  initDetailLightbox();
});
