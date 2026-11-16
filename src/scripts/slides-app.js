import Reveal from 'reveal.js';
import { createWebGLBackground } from './webgl-background.js';
import { createMotionController } from './motion-controller.js';
import { PRESENTATION_STEPS_CONFIG, SLIDE3_ZONES, SLIDE5_SCENES } from '../content/presentation-data.js';

export async function initPresentationApp() {
  const canvas = document.getElementById('webgl-canvas');
  const webgl = createWebGLBackground(canvas);
  const motion = createMotionController();

  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  // Presentation Timer State (does NOT reset when moving across sub-steps)
  let timerSeconds = 0;
  let timerInterval = null;
  let timerRunning = false;

  // Compute flat sequence registry across Landing (-1) and Slides 0..5
  const flatSteps = [];
  PRESENTATION_STEPS_CONFIG.forEach((conf) => {
    conf.steps.forEach((st) => {
      flatSteps.push({
        sequenceIndex: flatSteps.length,
        slideIndex: conf.slideIndex,
        slideId: conf.slideId,
        stepIndex: st.stepIndex,
        stepId: st.id,
        label: st.label
      });
    });
  });
  const totalGlobalSteps = flatSteps.length;

  // SINGLE SOURCE OF TRUTH: V4 GLOBAL PRESENTATION STATE ENGINE
  const state = {
    currentSequenceIndex: 0,
    currentSlideId: 'landing',
    currentStepId: 'landing-step-1',
    slideIndex: -1, // -1 = Landing Page, 0..5 = Slide 01..06
    stepIndex: 0,
    isAnimating: false,
    isTransitioning: false,
    isOverviewOpen: false,
    isLightboxOpen: false,
    presentationMode: 'presentation',
    mode: 'presentation',
    overlay: null
  };

  function getSlideConfig(slideIdx) {
    return PRESENTATION_STEPS_CONFIG.find((c) => c.slideIndex === slideIdx) || PRESENTATION_STEPS_CONFIG[0];
  }

  function getGlobalStepNumber(slideIdx, stepIdx) {
    let count = 0;
    for (const conf of PRESENTATION_STEPS_CONFIG) {
      if (conf.slideIndex < slideIdx) {
        count += conf.steps.length;
      } else if (conf.slideIndex === slideIdx) {
        count += stepIdx + 1;
        break;
      }
    }
    return count;
  }

  // Initialize Reveal.js with internal keyboard/touch disabled so our Global State Machine is the sole controller
  const deck = new Reveal({
    width: 1920,
    height: 1080,
    margin: 0.03,
    minScale: 0.15,
    maxScale: 2.0,
    controls: false,
    progress: false,
    keyboard: false,
    touch: false,
    history: false,
    center: true,
    hash: false,
    transition: 'fade',
    backgroundTransition: 'fade'
  });

  await deck.initialize();
  window.Reveal = deck;

  // Preload all curated Slide 03, Slide 05 & Slide 06 images for instant 0ms scene switching
  const preloadUrls = new Set([
    './assets/optimized/poster-full.jpg',
    './assets/optimized/crop-teacher.jpg',
    './assets/optimized/crop-teacher-code.jpg',
    './assets/curated/curated-16-co-lieu-20-11-flowers.jpg',
    './assets/curated/curated-18-co-lieu-aibot-rose.jpg'
  ]);
  SLIDE3_ZONES.forEach((z) => {
    if (z.cropSrc) preloadUrls.add(z.cropSrc);
  });
  SLIDE5_SCENES.forEach((sc) => {
    if (sc.hero?.src) preloadUrls.add(sc.hero.src);
    (sc.sidePhotos || []).forEach((sp) => {
      if (sp.src) preloadUrls.add(sp.src);
    });
  });
  preloadUrls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Sync when user clicks a slide in Reveal Overview Mode
  deck.on('slidechanged', (event) => {
    if (state.slideIndex !== -1 && event.indexh !== state.slideIndex && !state.isTransitioning) {
      goToState(event.indexh, 0);
    }
  });
  deck.on('overviewshown', () => {
    state.isOverviewOpen = true;
    state.presentationMode = 'overview';
  });
  deck.on('overviewhidden', () => {
    state.isOverviewOpen = false;
    state.presentationMode = 'presentation';
  });

  // Core State Transition Executor
  function goToState(targetSlideIndex, targetStepIndex) {
    const conf = getSlideConfig(targetSlideIndex);
    const clampedStep = Math.max(0, Math.min(targetStepIndex, conf.steps.length - 1));
    const prevSlideIndex = state.slideIndex;
    const isSlideChange = prevSlideIndex !== targetSlideIndex;

    const stepObj = conf.steps[clampedStep] || conf.steps[0];
    const seqIdx = getGlobalStepNumber(targetSlideIndex, clampedStep) - 1;

    state.slideIndex = targetSlideIndex;
    state.stepIndex = clampedStep;
    state.currentSequenceIndex = Math.max(0, seqIdx);
    state.currentSlideId = conf.slideId;
    state.currentStepId = stepObj.id;

    const landingEl = document.getElementById('landing-page');

    const applyVisuals = () => {
      if (targetSlideIndex === -1) {
        landingEl?.classList.remove('hidden');
        webgl.setSlideMood(0);
        motion.applyStep(-1, clampedStep, landingEl);
      } else {
        landingEl?.classList.add('hidden');
        if (deck.getState().indexh !== targetSlideIndex) {
          deck.slide(targetSlideIndex);
        }
        webgl.setSlideMood(targetSlideIndex);
        const slideEl =
          document.querySelector(`section[data-slide-id="slide-${targetSlideIndex + 1}"]`) || deck.getCurrentSlide();
        motion.applyStep(targetSlideIndex, clampedStep, slideEl);
      }

      updateHUDAndProgress();
      updatePresenterDrawer();
    };

    if (isSlideChange && !isReducedMotion) {
      state.isTransitioning = true;
      state.isAnimating = true;
      applyVisuals();
      setTimeout(() => {
        state.isTransitioning = false;
        state.isAnimating = false;
      }, 45);
    } else {
      applyVisuals();
    }
    return state;
  }

  function goToStep(idOrIndex, optionalStepIndex) {
    if (typeof optionalStepIndex === 'number') {
      return goToState(idOrIndex, optionalStepIndex);
    }
    if (typeof idOrIndex === 'number') {
      const target = flatSteps[Math.max(0, Math.min(idOrIndex, flatSteps.length - 1))];
      if (target) return goToState(target.slideIndex, target.stepIndex);
    }
    if (typeof idOrIndex === 'string') {
      const byStepId = flatSteps.find((s) => s.stepId === idOrIndex || s.slideId === idOrIndex);
      if (byStepId) return goToState(byStepId.slideIndex, byStepId.stepIndex);
    }
    return state;
  }

  // Unified NEXT Step (PowerPoint-like sequential navigation)
  function nextStep() {
    if (hasActiveModal()) {
      handleEscape();
      return state;
    }
    if (deck.isOverview()) {
      deck.toggleOverview(false);
      return state;
    }

    const conf = getSlideConfig(state.slideIndex);
    if (state.stepIndex < conf.steps.length - 1) {
      goToState(state.slideIndex, state.stepIndex + 1);
    } else if (state.slideIndex < 5) {
      goToState(state.slideIndex + 1, 0);
    }
    // At Final Hold State (Slide 06 last step), pressing Next holds steady and does NOT loop
    return state;
  }

  // Unified PREVIOUS Step (PowerPoint-like reverse navigation)
  function previousStep() {
    if (hasActiveModal()) {
      handleEscape();
      return state;
    }
    if (deck.isOverview()) {
      deck.toggleOverview(false);
      return state;
    }

    if (state.stepIndex > 0) {
      goToState(state.slideIndex, state.stepIndex - 1);
    } else if (state.slideIndex > -1) {
      const prevSlideIdx = state.slideIndex - 1;
      const prevConf = getSlideConfig(prevSlideIdx);
      goToState(prevSlideIdx, prevConf.steps.length - 1);
    }
    return state;
  }
  const prevStep = previousStep;

  function replayCurrentStep() {
    goToState(state.slideIndex, state.stepIndex);
  }

  function updateHUDAndProgress() {
    const conf = getSlideConfig(state.slideIndex);
    const stepNum = String(state.stepIndex + 1).padStart(2, '0');
    const stepTotal = String(conf.steps.length).padStart(2, '0');
    const indicator = document.getElementById('hud-indicator');

    if (indicator) {
      indicator.textContent = `${conf.hudPrefix} · ${conf.stepWord} ${stepNum} / ${stepTotal}`;
    }

    // Update Slide Header Badge if inside a slide
    if (state.slideIndex >= 0) {
      const slideEl = document.querySelector(`section[data-slide-id="slide-${state.slideIndex + 1}"]`);
      const badgeSpan = slideEl?.querySelector('.chapter-pill span:last-child');
      if (badgeSpan) {
        badgeSpan.textContent = `${conf.hudPrefix} · ${conf.stepWord} ${stepNum}/${stepTotal}`;
      }
    }

    // Update Global Bottom Progress Line
    const globalStep = getGlobalStepNumber(state.slideIndex, state.stepIndex);
    const pct = Math.round((globalStep / totalGlobalSteps) * 100);
    const barFill = document.getElementById('global-progress-fill');
    if (barFill) {
      barFill.style.width = `${pct}%`;
    }

    // Enable/disable Prev/Next visual states at boundaries
    const prevBtn = document.getElementById('hud-prev');
    const nextBtn = document.getElementById('hud-next');
    const atStart = state.slideIndex === -1 && state.stepIndex === 0;
    const atEnd = state.slideIndex === 5 && state.stepIndex === conf.steps.length - 1;
    if (prevBtn) prevBtn.disabled = atStart;
    if (nextBtn) nextBtn.disabled = atEnd;
  }

  function updatePresenterDrawer() {
    const conf = getSlideConfig(state.slideIndex);
    const stepObj = conf.steps[state.stepIndex] || conf.steps[0];

    const titleEl = document.getElementById('notes-slide-title');
    const timeEl = document.getElementById('notes-est-time');
    const cuesEl = document.getElementById('notes-cues');
    const scriptEl = document.getElementById('notes-content');
    const nextEl = document.getElementById('notes-next-slide');

    if (titleEl) {
      titleEl.textContent = `${conf.hudPrefix} · ${stepObj.label}`;
    }
    if (timeEl) {
      timeEl.textContent = `Thời lượng phần này: ${conf.estimatedTime}`;
    }
    if (cuesEl) {
      cuesEl.innerHTML = `<div>• <strong>Chỉ dẫn bước hiện tại:</strong> ${stepObj.cue}</div>`;
    }
    if (scriptEl) {
      scriptEl.textContent = stepObj.script;
    }

    // Compute next step label
    if (nextEl) {
      if (state.stepIndex < conf.steps.length - 1) {
        nextEl.textContent = `Bước tiếp: ${conf.steps[state.stepIndex + 1].label}`;
      } else if (state.slideIndex < 5) {
        const nextConf = getSlideConfig(state.slideIndex + 1);
        nextEl.textContent = `Chuyển sang: ${nextConf.hudPrefix} — ${nextConf.steps[0].label}`;
      } else {
        nextEl.textContent = `Trạng thái cuối: Cảnh kết Toàn bộ Poster (Final Hold State)`;
      }
    }
  }

  // Expose State & Control APIs on window for automated Playwright verification
  window.PresentationState = state;
  window.nextStep = nextStep;
  window.previousStep = previousStep;
  window.prevStep = previousStep;
  window.goToStep = goToStep;
  window.goToState = goToState;
  window.replayCurrentStep = replayCurrentStep;
  window.enterPresentation = () => goToState(0, 0);
  window.showLandingPage = () => goToState(-1, 0);
  window.switchSlide5Scene = (idx) => goToState(4, idx);
  window.setSlide6Mode = (mode) => goToState(5, mode === 'finale' ? 5 : 0);

  // Initial Boot at Landing Step 0
  goToState(-1, 0);

  // ===========================================================================
  // UNIFIED KEYBOARD, BUTTON & STAGE CLICK HANDLERS
  // ===========================================================================
  let lastKeyTimestamp = 0;

  window.addEventListener('keydown', (e) => {
    const now = performance.now();
    // Prevent rapid key-repeat flooding while allowing responsive single presses
    if (e.repeat && now - lastKeyTimestamp < 75) {
      e.preventDefault();
      return;
    }
    lastKeyTimestamp = now;

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      const tag = document.activeElement?.tagName;
      if (tag !== 'INPUT') {
        e.preventDefault();
        if (tag === 'BUTTON') document.activeElement.blur();
        nextStep();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      previousStep();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToState(-1, 0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToState(5, 5);
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      replayCurrentStep();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'n' || e.key === 'N' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      toggleNotes();
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      toggleReducedMotion();
    } else if (e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      if (state.slideIndex === -1) goToState(0, 0);
      deck.toggleOverview();
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      toggleEditMode();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEscape();
    }
  });

  // HUD & Interactive Buttons (All routed through Global State Machine!)
  document.getElementById('hud-prev')?.addEventListener('click', e => {
    e.stopPropagation();
    prevStep();
  });
  document.getElementById('hud-next')?.addEventListener('click', e => {
    e.stopPropagation();
    nextStep();
  });
  document.getElementById('hud-landing')?.addEventListener('click', e => {
    e.stopPropagation();
    goToState(-1, 0);
  });
  document.getElementById('hud-replay')?.addEventListener('click', e => {
    e.stopPropagation();
    replayCurrentStep();
  });
  document.getElementById('hud-fullscreen')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleFullscreen();
  });
  document.getElementById('hud-overview')?.addEventListener('click', e => {
    e.stopPropagation();
    if (state.slideIndex === -1) goToState(0, 0);
    deck.toggleOverview();
  });
  document.getElementById('hud-notes')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleNotes();
  });
  document.getElementById('hud-motion')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleReducedMotion();
  });
  document.getElementById('hud-help')?.addEventListener('click', e => {
    e.stopPropagation();
    toggleHelpModal();
  });

  // Landing CTA button -> Advances straight to Slide 01 Step 0 via State Machine
  document.getElementById('btn-enter-journey')?.addEventListener('click', e => {
    e.stopPropagation();
    goToState(0, 0);
  });

  // Slide 03 Zone Buttons -> Routed through State Machine
  document.querySelectorAll('[data-slide3-zone]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const zIdx = parseInt(el.getAttribute('data-slide3-zone'), 10);
      goToState(2, zIdx);
    });
  });

  // Slide 04 Criteria Pillar Clicks & Goto Slide 05 Button
  document.querySelectorAll('.criteria-pillar-card').forEach((card, idx) => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      goToState(3, idx + 1);
    });
  });
  document.getElementById('btn-goto-slide5')?.addEventListener('click', e => {
    e.stopPropagation();
    goToState(4, 0);
  });

  // Slide 05 Scene Tab Buttons -> Routed through State Machine
  document.querySelectorAll('[data-slide5-scene]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const sIdx = parseInt(btn.getAttribute('data-slide5-scene'), 10);
      goToState(4, sIdx);
    });
  });

  // Slide 06 Finale & Back Buttons -> Routed through State Machine
  document.getElementById('btn-trigger-finale')?.addEventListener('click', e => {
    e.stopPropagation();
    goToState(5, 3);
  });
  document.getElementById('btn-back-tribute')?.addEventListener('click', e => {
    e.stopPropagation();
    goToState(5, 2);
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

  // Lightbox Delegation
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

  function hasActiveModal() {
    return (
      document.getElementById('lightbox-modal')?.classList.contains('active') ||
      document.getElementById('help-modal-overlay')?.classList.contains('active')
    );
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
    state.isLightboxOpen = false;
    state.overlay = null;
    if (deck.isOverview()) deck.toggleOverview(false);
  }

  function openLightbox(src, caption) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (modal && img) {
      img.src = src;
      if (cap) cap.textContent = caption;
      modal.classList.add('active');
      state.isLightboxOpen = true;
      state.overlay = 'lightbox';
    }
  }

  function closeLightbox() {
    document.getElementById('lightbox-modal')?.classList.remove('active');
    state.isLightboxOpen = false;
    state.overlay = null;
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
          localStorage.setItem('dntu_v3_photo_' + key, dataUrl);
        } catch (_) {}
      };
      reader.readAsDataURL(file);
    }

    document.querySelectorAll('[data-replace-key]').forEach(imgEl => {
      const key = imgEl.getAttribute('data-replace-key');
      const saved = localStorage.getItem('dntu_v3_photo_' + key);
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
    motion,
    state,
    nextStep,
    prevStep,
    goToState
  };
}
