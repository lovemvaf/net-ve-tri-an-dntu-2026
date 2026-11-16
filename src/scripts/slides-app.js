import Reveal from 'reveal.js';
import { createWebGLBackground } from './webgl-background.js';
import { createMotionController } from './motion-controller.js';
import { SPEAKER_NOTES } from '../content/presentation-data.js';

export async function initPresentationApp() {
  const canvas = document.getElementById('webgl-canvas');
  const webgl = createWebGLBackground(canvas);
  const motion = createMotionController();

  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let currentSlide3Zone = 0;

  // Presentation Timer State (for 6-8 minute target)
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
      78: () => toggleNotes(),         // N: Speaker Notes / Presenter View
      83: () => toggleNotes(),         // S: Speaker Notes alias
      79: () => deck.toggleOverview(), // O: Overview
      82: () => replayCurrentSlide(),  // R: Replay current slide animation
      76: () => toggleReducedMotion(), // L: Lite / Reduced motion mode
      27: () => handleEscape()         // ESC: Close modals / drawers
    }
  });

  await deck.initialize();
  window.Reveal = deck;

  // Initial Slide Setup
  const initialIndex = deck.getState().indexh || 0;
  webgl.setSlideMood(initialIndex);
  updateHUD(initialIndex);
  updatePresenterDrawer(initialIndex);
  motion.animateSlide(deck.getCurrentSlide(), initialIndex);

  // Slide Change Listener
  deck.on('slidechanged', event => {
    const idx = event.indexh;
    webgl.setSlideMood(idx);
    updateHUD(idx);
    updatePresenterDrawer(idx);
    motion.animateSlide(event.currentSlide, idx);
    if (idx === 2) {
      currentSlide3Zone = 0;
      motion.focusSlide3Zone(0);
    }
  });

  // Slide 3 Interactive Focal Zone Buttons
  document.querySelectorAll('[data-slide3-zone]').forEach(el => {
    el.addEventListener('click', () => {
      const zIdx = parseInt(el.getAttribute('data-slide3-zone'), 10);
      currentSlide3Zone = zIdx;
      motion.focusSlide3Zone(zIdx);
    });
  });

  // HUD Controls
  document.getElementById('hud-prev')?.addEventListener('click', () => deck.prev());
  document.getElementById('hud-next')?.addEventListener('click', () => deck.next());
  document.getElementById('hud-replay')?.addEventListener('click', replayCurrentSlide);
  document.getElementById('hud-fullscreen')?.addEventListener('click', toggleFullscreen);
  document.getElementById('hud-overview')?.addEventListener('click', () => deck.toggleOverview());
  document.getElementById('hud-notes')?.addEventListener('click', toggleNotes);
  document.getElementById('hud-motion')?.addEventListener('click', toggleReducedMotion);
  document.getElementById('hud-help')?.addEventListener('click', toggleHelpModal);

  // Slide 4 Celebrate Button
  document.getElementById('btn-celebrate-5tot')?.addEventListener('click', () => {
    motion.triggerCelebrationConfetti();
  });

  // Presenter Timer Controls
  document.getElementById('btn-timer-toggle')?.addEventListener('click', toggleTimer);
  document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);

  // Close Modals & Drawers
  document.getElementById('close-notes-drawer')?.addEventListener('click', toggleNotes);
  document.getElementById('close-help-modal')?.addEventListener('click', toggleHelpModal);
  document.getElementById('help-modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'help-modal-overlay') toggleHelpModal();
  });

  // Lightbox Triggers for Poster & Art Crops
  document.querySelectorAll('[data-lightbox-src]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox-src') || el.querySelector('img')?.src || el.src;
      const caption = el.getAttribute('data-lightbox-caption') || el.getAttribute('alt') || 'Chi tiết tác phẩm';
      openLightbox(src, caption);
    });
  });

  document.getElementById('close-lightbox')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-modal')?.addEventListener('click', e => {
    if (e.target.id === 'lightbox-modal') closeLightbox();
  });

  // Initialize Replaceable Personal Images (Drag & Drop + Click button)
  initReplaceablePhotos();

  function replayCurrentSlide() {
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
          localStorage.setItem('dntu_2026_photo_' + key, dataUrl);
        } catch (err) {
          console.warn('LocalStorage full, keeping image in current session memory.');
        }
      };
      reader.readAsDataURL(file);
    }

    document.querySelectorAll('[data-replace-key]').forEach(imgEl => {
      const key = imgEl.getAttribute('data-replace-key');
      const saved = localStorage.getItem('dntu_2026_photo_' + key);
      if (saved) {
        imgEl.src = saved;
      }

      const container = imgEl.closest('.story-photo-slot, .author-portrait-frame');
      const replaceBtn = container?.querySelector('.slot-replace-btn');

      // Click on explicit "Thay ảnh" button opens file picker
      replaceBtn?.addEventListener('click', e => {
        e.stopPropagation();
        activeKey = key;
        activeImgEl = imgEl;
        fileInput.value = '';
        fileInput.click();
      });

      // Click on image itself opens Lightbox (or Alt+Click opens file picker)
      imgEl.addEventListener('click', e => {
        if (e.altKey || e.shiftKey) {
          e.stopPropagation();
          activeKey = key;
          activeImgEl = imgEl;
          fileInput.value = '';
          fileInput.click();
        } else {
          openLightbox(imgEl.src, imgEl.getAttribute('alt') || 'Hình ảnh hành trình DNTU');
        }
      });

      // Drag and drop image directly onto slot
      if (container) {
        container.addEventListener('dragover', e => {
          e.preventDefault();
          container.classList.add('drag-over');
        });
        container.addEventListener('dragleave', () => {
          container.classList.remove('drag-over');
        });
        container.addEventListener('drop', e => {
          e.preventDefault();
          container.classList.remove('drag-over');
          const file = e.dataTransfer?.files?.[0];
          if (file) applyFileToElement(file, key, imgEl);
        });
      }
    });

    fileInput?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (file && activeKey && activeImgEl) {
        applyFileToElement(file, activeKey, activeImgEl);
      }
    });

    document.getElementById('btn-reset-gallery')?.addEventListener('click', () => {
      document.querySelectorAll('[data-replace-key]').forEach(imgEl => {
        const key = imgEl.getAttribute('data-replace-key');
        const def = imgEl.getAttribute('data-default-src');
        if (def) {
          imgEl.src = def;
          localStorage.removeItem('dntu_2026_photo_' + key);
        }
      });
    });
  }

  return {
    deck,
    webgl,
    motion
  };
}
