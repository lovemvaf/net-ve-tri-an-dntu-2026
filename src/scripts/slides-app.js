import Reveal from 'reveal.js';
import gsap from 'gsap';
import { createWebGLBackground } from './webgl-background.js';
import { createMotionController } from './motion-controller.js';
import { SPEAKER_NOTES, SLIDE5_SCENES } from '../content/presentation-data.js';

export async function initPresentationApp() {
  const canvas = document.getElementById('webgl-canvas');
  const webgl = createWebGLBackground(canvas);
  const motion = createMotionController();

  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let isLandingActive = true;
  let currentSlide5Scene = 0;
  let currentSlide6Mode = 'tribute'; // 'tribute' | 'finale'

  // Presentation Timer State (6–8 minute target)
  let timerSeconds = 0;
  let timerInterval = null;
  let timerRunning = false;

  const deck = new Reveal({
    width: 1920,
    height: 1080,
    margin: 0.03,
    minScale: 0.15,
    maxScale: 2.0,
    controls: false,
    progress: true,
    history: true,
    center: true,
    hash: true,
    transition: 'fade',
    backgroundTransition: 'fade',
    keyboard: {
      70: () => toggleFullscreen(),    // F: Fullscreen
      78: () => toggleNotes(),         // N: Speaker Notes
      83: () => toggleNotes(),         // S: Speaker Notes alias
      79: () => deck.toggleOverview(), // O: Overview
      82: () => replayCurrentView(),   // R: Replay animation
      76: () => toggleReducedMotion(), // L: Lite mode
      69: () => toggleEditMode(),      // E: Toggle Edit Mode for custom photos
      36: () => showLandingPage(),     // Home: Return to 20/11 Landing Page
      27: () => handleEscape()         // ESC: Close modals / drawers
    }
  });

  await deck.initialize();
  window.Reveal = deck;

  // Expose helper APIs on window for automated QA & keyboard/UI control
  window.enterPresentation = enterPresentation;
  window.showLandingPage = showLandingPage;
  window.switchSlide5Scene = switchSlide5Scene;
  window.setSlide6Mode = setSlide6Mode;

  // Play Opening Choreography on the 20/11 Landing Page
  motion.animateLandingOpening();

  // Button to Enter Slide 01 from Landing Page
  document.getElementById('btn-enter-journey')?.addEventListener('click', () => {
    enterPresentation();
  });

  // Slide Change Listener
  deck.on('slidechanged', event => {
    const idx = event.indexh;
    webgl.setSlideMood(idx);
    updateHUD(idx);
    updatePresenterDrawer(idx);
    motion.animateSlide(event.currentSlide, idx);
    if (idx === 2) {
      motion.focusSlide3Zone(0);
    }
  });

  // Slide 03 Interactive Focal Zone Buttons
  document.querySelectorAll('[data-slide3-zone]').forEach(el => {
    el.addEventListener('click', () => {
      const zIdx = parseInt(el.getAttribute('data-slide3-zone'), 10);
      motion.focusSlide3Zone(zIdx);
    });
  });

  // Slide 04 Transition Button to Slide 05 Real Photos
  document.getElementById('btn-goto-slide5')?.addEventListener('click', () => {
    deck.slide(4);
  });

  // Slide 05 Interactive 5-Scene Exhibition Buttons
  document.querySelectorAll('[data-slide5-scene]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sIdx = parseInt(btn.getAttribute('data-slide5-scene'), 10);
      switchSlide5Scene(sIdx);
    });
  });

  // Slide 06 Finale Toggle Buttons
  document.getElementById('btn-trigger-finale')?.addEventListener('click', () => {
    setSlide6Mode('finale');
  });
  document.getElementById('btn-back-tribute')?.addEventListener('click', () => {
    setSlide6Mode('tribute');
  });

  // HUD Controls
  document.getElementById('hud-landing')?.addEventListener('click', showLandingPage);
  document.getElementById('hud-prev')?.addEventListener('click', () => deck.prev());
  document.getElementById('hud-next')?.addEventListener('click', () => deck.next());
  document.getElementById('hud-replay')?.addEventListener('click', replayCurrentView);
  document.getElementById('hud-fullscreen')?.addEventListener('click', toggleFullscreen);
  document.getElementById('hud-overview')?.addEventListener('click', () => deck.toggleOverview());
  document.getElementById('hud-notes')?.addEventListener('click', toggleNotes);
  document.getElementById('hud-motion')?.addEventListener('click', toggleReducedMotion);
  document.getElementById('hud-help')?.addEventListener('click', toggleHelpModal);

  // Presenter Timer Controls
  document.getElementById('btn-timer-toggle')?.addEventListener('click', toggleTimer);
  document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);

  // Close Modals & Drawers
  document.getElementById('close-notes-drawer')?.addEventListener('click', toggleNotes);
  document.getElementById('close-help-modal')?.addEventListener('click', toggleHelpModal);
  document.getElementById('help-modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'help-modal-overlay') toggleHelpModal();
  });

  // Lightbox Delegation for All Exhibition & Poster Images
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox-src], .exhibition-hero-img-wrap, .exhibition-side-img-wrap, .author-portrait-img');
    if (!trigger) return;
    if (e.target.closest('.slot-replace-btn')) return;

    const imgEl = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
    const src = trigger.getAttribute('data-lightbox-src') || imgEl?.src;
    const caption = trigger.getAttribute('data-lightbox-caption') || imgEl?.getAttribute('alt') || 'Chi tiết hình ảnh';
    if (src) {
      openLightbox(src, caption);
    }
  });

  document.getElementById('close-lightbox')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-modal')?.addEventListener('click', e => {
    if (e.target.id === 'lightbox-modal') closeLightbox();
  });

  initReplaceablePhotos();

  function enterPresentation() {
    const landing = document.getElementById('landing-page');
    const hud = document.getElementById('main-hud-bar');
    isLandingActive = false;
    landing?.classList.add('hidden');
    hud?.classList.remove('hidden-on-landing');

    const idx = deck.getState().indexh || 0;
    webgl.setSlideMood(idx);
    updateHUD(idx);
    updatePresenterDrawer(idx);
    motion.animateSlide(deck.getCurrentSlide(), idx);
  }

  function showLandingPage() {
    const landing = document.getElementById('landing-page');
    const hud = document.getElementById('main-hud-bar');
    isLandingActive = true;
    landing?.classList.remove('hidden');
    hud?.classList.add('hidden-on-landing');
    motion.animateLandingOpening();
  }

  function switchSlide5Scene(sceneIdx) {
    const scene = SLIDE5_SCENES[sceneIdx] || SLIDE5_SCENES[0];
    currentSlide5Scene = sceneIdx;

    document.querySelectorAll('[data-slide5-scene]').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === sceneIdx);
    });

    const stage = document.getElementById('slide5-exhibition-stage');
    const applyContent = () => {
      const eyebrow = document.getElementById('s5-scene-eyebrow');
      const heroImg = document.getElementById('s5-hero-img');
      const heroBadge = document.getElementById('s5-hero-badge');
      const heroTitle = document.getElementById('s5-hero-title');
      const heroCap = document.getElementById('s5-hero-caption');

      const s1Img = document.getElementById('s5-side1-img');
      const s1Badge = document.getElementById('s5-side1-badge');
      const s1Title = document.getElementById('s5-side1-title');
      const s1Cap = document.getElementById('s5-side1-caption');

      const s2Img = document.getElementById('s5-side2-img');
      const s2Badge = document.getElementById('s5-side2-badge');
      const s2Title = document.getElementById('s5-side2-title');
      const s2Cap = document.getElementById('s5-side2-caption');

      if (eyebrow) eyebrow.textContent = scene.eyebrow;
      if (heroImg) {
        heroImg.src = scene.hero.src;
        heroImg.alt = scene.hero.title;
      }
      if (heroBadge) heroBadge.textContent = scene.hero.badge;
      if (heroTitle) heroTitle.textContent = scene.hero.title;
      if (heroCap) heroCap.textContent = scene.hero.caption;

      if (scene.sidePhotos[0]) {
        if (s1Img) {
          s1Img.src = scene.sidePhotos[0].src;
          s1Img.alt = scene.sidePhotos[0].title;
        }
        if (s1Badge) s1Badge.textContent = scene.sidePhotos[0].badge;
        if (s1Title) s1Title.textContent = scene.sidePhotos[0].title;
        if (s1Cap) s1Cap.textContent = scene.sidePhotos[0].caption;
      }

      if (scene.sidePhotos[1]) {
        if (s2Img) {
          s2Img.src = scene.sidePhotos[1].src;
          s2Img.alt = scene.sidePhotos[1].title;
        }
        if (s2Badge) s2Badge.textContent = scene.sidePhotos[1].badge;
        if (s2Title) s2Title.textContent = scene.sidePhotos[1].title;
        if (s2Cap) s2Cap.textContent = scene.sidePhotos[1].caption;
      }
    };

    if (!stage || isReducedMotion) {
      applyContent();
      return;
    }

    gsap.to(stage, {
      opacity: 0,
      y: 8,
      duration: 0.2,
      onComplete: () => {
        applyContent();
        gsap.to(stage, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' });
      }
    });
  }

  function setSlide6Mode(mode) {
    currentSlide6Mode = mode;
    const tributeView = document.getElementById('slide6-tribute-view');
    const finaleView = document.getElementById('slide6-finale-view');
    const finalePosterFrame = document.querySelector('.finale-poster-frame');
    const finalePosterImg = document.getElementById('finale-full-poster-img');

    if (mode === 'finale') {
      tributeView?.classList.add('hidden');
      finaleView?.classList.add('active');
      // Guarantee zero crop / zero zoom transform on the final poster reveal
      if (finalePosterFrame) gsap.set(finalePosterFrame, { clearProps: 'transform' });
      if (finalePosterImg) gsap.set(finalePosterImg, { clearProps: 'transform' });

      if (!isReducedMotion && finaleView) {
        gsap.fromTo(
          finaleView,
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: 'power2.out', clearProps: 'transform' }
        );
      }
    } else {
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');
      if (!isReducedMotion && tributeView) {
        gsap.fromTo(
          tributeView,
          { opacity: 0 },
          { opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform' }
        );
      }
    }
  }

  function replayCurrentView() {
    if (isLandingActive) {
      motion.animateLandingOpening();
      return;
    }
    const idx = deck.getState().indexh || 0;
    motion.animateSlide(deck.getCurrentSlide(), idx);
  }

  function updateHUD(index) {
    const total = deck.getTotalSlides();
    const indicator = document.getElementById('hud-indicator');
    if (indicator) {
      indicator.textContent = `0${index + 1} / 0${total}`;
    }
  }

  function updatePresenterDrawer(index) {
    const noteData = SPEAKER_NOTES[index] || SPEAKER_NOTES[0];
    const titleEl = document.getElementById('notes-slide-title');
    const timeEl = document.getElementById('notes-est-time');
    const cuesEl = document.getElementById('notes-cues');
    const scriptEl = document.getElementById('notes-content');
    const nextEl = document.getElementById('notes-next-slide');

    if (titleEl) titleEl.textContent = noteData.slideTitle;
    if (timeEl) timeEl.textContent = `Thời lượng gợi ý: ${noteData.estimatedTime}`;
    if (cuesEl) cuesEl.innerHTML = noteData.cues.map(c => `<div>• ${c}</div>`).join('');
    if (scriptEl) scriptEl.textContent = noteData.script;
    if (nextEl) nextEl.textContent = `Tiếp theo: ${noteData.nextSlideTitle}`;
  }

  function toggleTimer() {
    const btn = document.getElementById('btn-timer-toggle');
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      if (btn) btn.textContent = '▶ Tiếp tục';
    } else {
      timerRunning = true;
      if (btn) btn.textContent = '⏸ Tạm dừng';
      timerInterval = setInterval(() => {
        timerSeconds++;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        const readout = document.getElementById('presenter-timer-display');
        if (readout) readout.textContent = `${mins}:${secs}`;
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 0;
    const readout = document.getElementById('presenter-timer-display');
    const btn = document.getElementById('btn-timer-toggle');
    if (readout) readout.textContent = '00:00';
    if (btn) btn.textContent = '▶ Bắt đầu đếm giờ';
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function toggleNotes() {
    const drawer = document.getElementById('notes-drawer');
    const btn = document.getElementById('hud-notes');
    if (drawer) {
      drawer.classList.toggle('active');
      btn?.classList.toggle('active', drawer.classList.contains('active'));
    }
  }

  function toggleHelpModal() {
    const modal = document.getElementById('help-modal-overlay');
    if (modal) modal.classList.toggle('active');
  }

  function toggleReducedMotion() {
    isReducedMotion = !isReducedMotion;
    document.body.classList.toggle('reduced-motion', isReducedMotion);
    webgl.setReducedMotion(isReducedMotion);
    motion.setReducedMotion(isReducedMotion);
    const btn = document.getElementById('hud-motion');
    const statusText = document.getElementById('notes-motion-status');
    btn?.classList.toggle('active', isReducedMotion);
    if (statusText) {
      statusText.textContent = isReducedMotion ? 'Chế độ: Giảm hiệu ứng (Lite)' : 'Chế độ: Cinematic Đầy đủ';
    }
  }

  function toggleEditMode() {
    document.body.classList.toggle('edit-mode');
  }

  function handleEscape() {
    document.getElementById('lightbox-modal')?.classList.remove('active');
    document.getElementById('help-modal-overlay')?.classList.remove('active');
    document.getElementById('notes-drawer')?.classList.remove('active');
    document.getElementById('hud-notes')?.classList.remove('active');
  }

  function openLightbox(src, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (modal && img) {
      img.src = src;
      if (cap) cap.textContent = caption;
      modal.classList.add('active');
    }
  }

  function closeLightbox() {
    document.getElementById('lightbox-modal')?.classList.remove('active');
  }

  function initReplaceablePhotos() {
    const fileInput = document.getElementById('image-uploader-input');
    let activeKey = null;
    let activeImgEl = null;

    function applyFileToElement(file, key, imgEl) {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target.result;
        imgEl.src = dataUrl;
        try {
          localStorage.setItem('dntu_v2_photo_' + key, dataUrl);
        } catch (_) {}
      };
      reader.readAsDataURL(file);
    }

    document.querySelectorAll('[data-replace-key]').forEach(imgEl => {
      const key = imgEl.getAttribute('data-replace-key');
      const saved = localStorage.getItem('dntu_v2_photo_' + key);
      if (saved) imgEl.src = saved;

      const container = imgEl.closest('.exhibition-hero-card, .exhibition-side-card, .author-portrait-frame');
      const replaceBtn = container?.querySelector('.slot-replace-btn');

      replaceBtn?.addEventListener('click', e => {
        e.stopPropagation();
        activeKey = key;
        activeImgEl = imgEl;
        fileInput.value = '';
        fileInput.click();
      });
    });

    fileInput?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (file && activeKey && activeImgEl) {
        applyFileToElement(file, activeKey, activeImgEl);
      }
    });
  }

  return {
    deck,
    webgl,
    motion
  };
}
