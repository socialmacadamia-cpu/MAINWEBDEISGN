/* ===================================================================
   מקדמיה — לוגיקת האתר
   כל מודול בודק אם האלמנטים שלו קיימים בעמוד, כך שהקובץ משותף
   לדף הבית ולעמוד הקורס.
   =================================================================== */

(function () {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = matchMedia('(max-width: 880px)');

  /* ---------- וואטסאפ + לינקים חברתיים מהקונפיג ---------- */

  const waNum = (cfg.whatsappNumber || '').replace(/\D/g, '');
  const waHref = waNum ? 'https://wa.me/' + waNum : null;
  document.querySelectorAll('[data-wa]').forEach(a => {
    if (waHref) a.href = waHref;
    else a.href = a.dataset.waFallback || '#contact';
    if (!waHref) { a.removeAttribute('target'); }
  });

  const socialMap = { instagram: cfg.instagramUrl, tiktok: cfg.tiktokUrl, facebook: cfg.facebookUrl };
  document.querySelectorAll('[data-social]').forEach(a => {
    const url = socialMap[a.dataset.social];
    if (url) a.href = url;
    else { a.href = '#'; a.removeAttribute('target'); }
  });

  /* ---------- Header: רקע בגלילה + CTA ---------- */

  const header = document.querySelector('.site-header');
  const scrollHint = document.querySelector('.scroll-hint');

  function onScrollHeader() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 80);
    if (scrollHint) scrollHint.classList.toggle('hidden', y > 40);
  }
  addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- תפריט מובייל ---------- */

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
    mobileQuery.addEventListener('change', () => mobileMenu.classList.remove('open'));
  }

  /* ---------- Reveal: כניסת אלמנטים ב-fade-up ---------- */

  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion) {
    revealEls.forEach(el => el.classList.add('revealed'));
  } else if (revealEls.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
      el.classList.add('revealed');
      io.unobserve(el);
    }), { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
    // ביטחון: אם משהו לא נצפה תוך 3 שניות מגלילה ראשונה — לחשוף
    setTimeout(() => revealEls.forEach(el => el.classList.add('revealed')), 5000);
  }

  /* ---------- הירו: וידאו שרץ פעם אחת ונעצר בפריים הלוגואים ---------- */

  const heroVid = document.getElementById('heroVid');
  if (heroVid) {
    const freezePct = Math.min(99, Math.max(50, +cfg.heroFreezePct || 85)) / 100;
    // עוצר קדימה בפריים העצירה בלי לקפוץ אחורה (קפיצה אחורה ב-webm לא אמינה)
    let frozen = false;
    const freezeAt = () => {
      if (frozen || !heroVid.duration) return;
      if (heroVid.currentTime >= heroVid.duration * freezePct) {
        frozen = true;
        heroVid.pause();
      }
    };
    heroVid.addEventListener('timeupdate', freezeAt);
    // רשת ביטחון: אם בכל זאת הגיע לסוף, להישאר על הפריים האחרון (לא לחזור להתחלה)
    heroVid.addEventListener('ended', () => { frozen = true; heroVid.pause(); });
    if (reducedMotion) {
      // בלי אנימציה: מדלגים לפריים העצירה בלי ניגון גלוי.
      // מנגנים בהשתקה ועוצרים ברגע שעברנו את נקודת העצירה — קפיצת currentTime
      // ישירה על webp/webm לא תמיד נוחתת, אז עדיף לתת לו "לרוץ" ולעצור.
      const seek = () => {
        if (!heroVid.duration) { heroVid.addEventListener('loadedmetadata', seek, { once: true }); return; }
        heroVid.currentTime = heroVid.duration * freezePct;
        heroVid.play().then(() => {
          // אם הקפיצה נחתה — עוצרים מיד; אחרת freezeAt יתפוס אותו תוך שנייה
          if (heroVid.currentTime >= heroVid.duration * freezePct - 0.1) { frozen = true; heroVid.pause(); }
        }).catch(() => {});
      };
      seek();
    } else {
      heroVid.play().catch(() => {});
    }
  }

  /* ---------- שירותים: 3D tilt לכיוון העכבר ---------- */

  if (!reducedMotion) {
    let tiltEl = null;
    document.addEventListener('pointermove', e => {
      const card = e.target.closest ? e.target.closest('[data-tilt]') : null;
      if (tiltEl && tiltEl !== card) { tiltEl.style.transform = 'none'; tiltEl = null; }
      if (!card) return;
      tiltEl = card;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        'perspective(900px) rotateX(' + (-y * 10).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg) translateY(-4px)';
    });
  }

  /* ---------- מונים: count-up בכניסה לפריים ---------- */

  const countersSection = document.getElementById('counters');
  if (countersSection) {
    // מילוי ערכים מהקונפיג
    document.querySelectorAll('[data-counter]').forEach(el => {
      const c = (cfg.counters || {})[el.dataset.counter];
      if (!c) return;
      el.dataset.end = c.value == null ? '' : c.value;
      el.dataset.suffix = c.suffix || '';
      if (c.value == null) el.textContent = '[X]';
    });

    let counted = false;
    const runCountUp = () => {
      if (counted) return;
      counted = true;
      const els = [...countersSection.querySelectorAll('[data-counter]')].filter(el => el.dataset.end !== '');
      if (reducedMotion) {
        els.forEach(el => { el.textContent = el.dataset.end + el.dataset.suffix; });
        return;
      }
      const t0 = performance.now(), dur = 1400;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        els.forEach(el => {
          el.textContent = Math.round(+el.dataset.end * ease) + el.dataset.suffix;
        });
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { runCountUp(); cio.disconnect(); }
    }, { threshold: 0.3 });
    cio.observe(countersSection);
  }

  /* ---------- עבודות: טלפונים צפים לפי התקדמות גלילה ---------- */

  const workSection = document.getElementById('work');
  const processSection = document.getElementById('process');
  const phones = [...document.querySelectorAll('.floating-phone')];

  /* ---------- התהליך: מילוי קו + הדלקת תחנות ---------- */

  const procFill = document.getElementById('procFill');
  const badges = [...document.querySelectorAll('.step-badge')];

  function onScrollEffects() {
    // טלפונים צפים (דסקטופ בלבד)
    if (!reducedMotion && !mobileQuery.matches && phones.length && workSection && processSection) {
      const a = workSection.getBoundingClientRect();
      const b = processSection.getBoundingClientRect();
      const total = Math.max(1, b.bottom - a.top);
      const p = (innerHeight * 0.9 - a.top) / total;
      phones.forEach(el => {
        const kIn = +el.dataset.in || 0;
        if (p <= kIn || p >= 1.08) { el.style.opacity = '0'; return; }
        const fadeIn = Math.min(1, (p - kIn) / 0.12);
        const fadeOut = p > 0.92 ? Math.max(0, (1.08 - p) / 0.16) : 1;
        el.style.opacity = String(Math.min(fadeIn, fadeOut));
        const k = +el.dataset.k || 0;
        const ty = (p - 0.5) * (90 + k * 260) + (1 - fadeIn) * 40;
        const rz = (+el.dataset.rot || 0) + (p - 0.5) * 14 * (k > 0.25 ? -1 : 1);
        const ry = Math.sin(p * Math.PI * 1.5 + k * 7) * 14;
        el.style.transform =
          'perspective(1100px) translateY(' + ty + 'px) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg)';
      });
    }

    // קו התהליך
    if (processSection && procFill) {
      const r = processSection.getBoundingClientRect();
      const pp = Math.max(0, Math.min(1, (innerHeight * 0.65 - r.top) / r.height));
      procFill.style.height = (pp * 100) + '%';
      badges.forEach((el, i) => {
        el.classList.toggle('on', pp >= (i + 0.55) / badges.length);
      });
    }
  }

  if (phones.length || procFill) {
    let rafPending = false;
    addEventListener('scroll', () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => { onScrollEffects(); rafPending = false; });
    }, { passive: true });
    addEventListener('resize', onScrollEffects);
    onScrollEffects();
  }

  /* ---------- רילים: הזרקת תוכן אמיתי מהקונפיג ---------- */

  (cfg.reels || []).forEach((reel, i) => {
    if (!reel.src) return;
    document.querySelectorAll('[data-reel="' + i + '"]').forEach(screen => {
      screen.querySelector('.phone-file')?.remove();
      const vid = document.createElement('video');
      vid.src = reel.src;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'none';
      screen.prepend(vid);
      const tag = screen.querySelector('.views-tag');
      if (tag) tag.textContent = (reel.client ? reel.client + ' · ' : '') + (reel.views ? reel.views + ' ▶' : '▶');
      // דסקטופ: ניגון ב-hover; מובייל: בלחיצה
      screen.addEventListener('pointerenter', () => vid.play().catch(() => {}));
      screen.addEventListener('pointerleave', () => vid.pause());
      screen.addEventListener('click', () => { vid.paused ? vid.play().catch(() => {}) : vid.pause(); });
    });
  });

  /* ---------- לוגואי לקוחות אמיתיים ---------- */

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && (cfg.clientLogos || []).length) {
    marqueeTrack.innerHTML = '';
    const logos = cfg.clientLogos;
    // מכפילים עד מינימום 16 פריטים (8 כפולים) ללופ חלק
    const repeats = Math.max(2, Math.ceil(16 / logos.length));
    for (let r = 0; r < repeats; r++) {
      logos.forEach(lg => {
        const img = document.createElement('img');
        img.src = lg.src;
        img.alt = lg.name || '';
        img.className = 'client-logo-img';
        img.loading = 'lazy';
        marqueeTrack.appendChild(img);
      });
    }
  }

  /* ---------- FAQ אקורדיון ---------- */

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-wrap').querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- טופס יצירת קשר ---------- */

  document.querySelectorAll('form[data-lead-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // TODO: חיבור יעד שליחה אמיתי (מייל/וובהוק) — ראה README
      form.hidden = true;
      const success = form.parentElement.querySelector('.form-success');
      if (success) success.hidden = false;
    });
  });

})();
