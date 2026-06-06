/* =============================================
   SOLARTEX LIMITED — Shared JavaScript
   nav.js: hamburger menu, active state, carousel
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── ACTIVE NAV LINK ──────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  // ── HAMBURGER / MOBILE MENU ──────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── CAROUSEL ────────────────────────────────
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  if (track) {
    const cards     = track.querySelectorAll('.tender-card');
    const cardCount = cards.length;
    let currentIdx  = 0;

    // Build dots
    if (dotsWrap) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(i));
        dotsWrap.appendChild(dot);
      });
    }

    function scrollToCard(idx) {
      const card   = cards[idx];
      const offset = card.offsetLeft - track.offsetLeft - 32;
      track.scrollTo({ left: offset, behavior: 'smooth' });
      currentIdx = idx;
      updateDots();
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIdx);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIdx = Math.max(0, currentIdx - 1);
        scrollToCard(currentIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIdx = Math.min(cardCount - 1, currentIdx + 1);
        scrollToCard(currentIdx);
      });
    }

    // Drag-to-scroll
    let isDown = false, startX = 0, scrollLeft = 0;

    track.addEventListener('mousedown', e => {
      isDown = true; track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        currentIdx = diff > 0
          ? Math.min(cardCount - 1, currentIdx + 1)
          : Math.max(0, currentIdx - 1);
        scrollToCard(currentIdx);
      }
    });

    // Auto-advance
    let autoTimer = setInterval(() => {
      currentIdx = currentIdx >= cardCount - 1 ? 0 : currentIdx + 1;
      scrollToCard(currentIdx);
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        currentIdx = currentIdx >= cardCount - 1 ? 0 : currentIdx + 1;
        scrollToCard(currentIdx);
      }, 5000);
    });
  }

  // ── APPLICATION FORM ─────────────────────────
  const form = document.getElementById('applyForm');
  const successMsg = document.getElementById('successMessage');

  if (form) {
    // File upload display
    const fileInput = document.getElementById('docUpload');
    const fileLabel = document.getElementById('fileLabel');
    if (fileInput && fileLabel) {
      fileInput.addEventListener('change', () => {
        const names = Array.from(fileInput.files).map(f => f.name).join(', ');
        fileLabel.textContent = names || 'Click to upload or drag & drop';
      });
    }

    // Submit
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

});
