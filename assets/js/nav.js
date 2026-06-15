/* =============================================
   SOLARTEX LIMITED — Shared JavaScript
   nav.js: hamburger, active nav, spotlight carousel, forms
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── ACTIVE NAV LINK ──────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  // ── HAMBURGER / MOBILE MENU ──────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── SPOTLIGHT CAROUSEL ───────────────────────
  const slides      = Array.from(document.querySelectorAll('.spotlight-slide'));
  const tabs        = Array.from(document.querySelectorAll('.stab'));
  const prevBtn     = document.getElementById('spotPrev');
  const nextBtn     = document.getElementById('spotNext');

  if (!slides.length) return initForms(); // skip if not on homepage

  let current    = 0;
  let autoTimer  = null;
  let progTimer  = null;
  const DURATION = 6000; // ms per slide

  function goTo(idx, dir = 'next') {
    // hide current
    slides[current].classList.remove('active');
    tabs[current].classList.remove('active');
    stopProgress(current);

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('active');
    tabs[current].classList.add('active');
    startProgress(current);
  }

  function startProgress(idx) {
    const fill = slides[idx].querySelector('.slide-progress-fill');
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    // force reflow
    fill.getBoundingClientRect();
    fill.style.transition = `width ${DURATION}ms linear`;
    fill.style.width = '100%';
  }

  function stopProgress(idx) {
    const fill = slides[idx].querySelector('.slide-progress-fill');
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), DURATION);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Tab clicks
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i === current) return;
      goTo(i);
      resetAuto();
    });
  });

  // Arrow clicks
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Pause on hover
  const trackWrap = document.querySelector('.spotlight-track-wrap');
  if (trackWrap) {
    trackWrap.addEventListener('mouseenter', stopAuto);
    trackWrap.addEventListener('mouseleave', () => { stopAuto(); startAuto(); });
  }

  // Touch swipe
  let touchStartX = 0;
  const track = document.querySelector('.spotlight-track');
  if (track) {
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    });
  }

  // Boot
  startProgress(0);
  startAuto();

  initForms();
});

// ── APPLICATION FORM ─────────────────────────
function initForms() {
  const form       = document.getElementById('applyForm');
  const successMsg = document.getElementById('successMessage');

  if (!form) return;

  const fileInput = document.getElementById('docUpload');
  const fileLabel = document.getElementById('fileLabel');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const names = Array.from(fileInput.files).map(f => f.name).join(', ');
      fileLabel.textContent = names || 'Click to upload or drag & drop';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Submitting…';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1200);
  });
}
