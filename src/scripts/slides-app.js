import Reveal from 'reveal.js';
import { EXHIBITION_META, SCENES } from '../content/presentation-data.js';
import { createWebGLBackground } from './webgl-background.js';
import { createMotionController } from './motion-controller.js';

export async function initPresentationApp() {
  const backdropCanvas = document.getElementById('editorial-backdrop-canvas');
  const backdrop = createWebGLBackground(backdropCanvas);
  const motion = createMotionController();

  const totalScenes = SCENES.length;
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  const state = {
    sceneIndex: 0,
    sceneNumber: 1,
    totalScenes,
    sceneLabel: SCENES[0].badge,
    isFirst: true,
    isLast: false,
    notesOpen: true,
    liteMode: prefersReduced,
    zoomOpen: false,
    isFullscreen: false
  };

  if (state.liteMode) {
    document.body.classList.add('lite-mode');
    backdrop.setReducedMotion(true);
    motion.setDisabled(true);
  }

  // Initialize Reveal.js with layout & native key capture disabled so our 5-scene controller stays authoritative
  const deck = new Reveal(document.getElementById('nq57-reveal'), {
    disableLayout: true,
    controls: false,
    progress: false,
    keyboard: false,
    touch: false,
    history: false,
    hash: false,
    loop: false,
    overview: true,
    transition: 'none'
  });

  await deck.initialize();
  window.Reveal = deck;

  // Preload all 5 official posters and Đoàn emblem for 0ms scene transitions
  [EXHIBITION_META.emblemSrc, ...SCENES.map((s) => s.posterSrc)].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // DOM references
  const shellEl = document.getElementById('exhibition-shell');
  const posterImg = document.getElementById('poster-stage-img');
  const posterFrame = document.getElementById('poster-museum-frame');
  const hudProgress = document.getElementById('hud-progress');
  const railStepBadge = document.getElementById('rail-step-badge');
  const railPhaseTag = document.getElementById('rail-phase-tag');
  const railBeatHeading = document.getElementById('rail-beat-heading');
  const railNarrativeBody = document.getElementById('rail-narrative-body');
  const railTransitionNote = document.getElementById('rail-transition-note');
  const speakerCuePanel = document.getElementById('speaker-cue-panel');
  const speakerCueText = document.getElementById('speaker-cue-text');
  const scene05Actions = document.getElementById('scene-05-actions');
  const globalProgressFill = document.getElementById('global-progress-fill');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnNotes = document.getElementById('btn-notes');
  const btnCollapseCue = document.getElementById('btn-collapse-cue');
  const btnZoom = document.getElementById('btn-zoom');
  const btnRestart = document.getElementById('btn-restart');
  const btnLite = document.getElementById('btn-lite');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox');
  const pillButtons = Array.from(document.querySelectorAll('[data-scene-pill]'));

  let isSyncingReveal = false;

  function renderScene(targetIndex, { animate = true, fromIndex = state.sceneIndex } = {}) {
    const scene = SCENES[targetIndex] || SCENES[0];

    state.sceneIndex = scene.index;
    state.sceneNumber = scene.index + 1;
    state.sceneLabel = scene.badge;
    state.isFirst = scene.index === 0;
    state.isLast = scene.index === totalScenes - 1;

    if (shellEl) shellEl.setAttribute('data-scene-index', String(scene.index));

    if (posterImg) {
      posterImg.src = scene.posterSrc;
      posterImg.alt = scene.posterAlt;
    }

    if (hudProgress) hudProgress.textContent = scene.badge;
    if (railStepBadge) railStepBadge.textContent = scene.badge;
    if (railPhaseTag) railPhaseTag.textContent = scene.phaseTag;
    if (railBeatHeading) railBeatHeading.textContent = scene.beatHeading;
    if (railNarrativeBody) railNarrativeBody.textContent = scene.narrativePurpose;
    if (railTransitionNote) railTransitionNote.textContent = scene.transitionNote;
    if (speakerCueText) speakerCueText.textContent = `“${scene.speakerCue}”`;

    if (scene05Actions) {
      scene05Actions.hidden = !scene.isFinal;
    }

    if (globalProgressFill) {
      const pct = Math.round(((scene.index + 1) / totalScenes) * 100);
      globalProgressFill.style.width = `${pct}%`;
    }

    pillButtons.forEach((btn, idx) => {
      const active = idx === scene.index;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (btnPrev) btnPrev.disabled = state.isFirst;
    if (btnNext) btnNext.disabled = state.isLast;

    // Keep zoom lightbox synced if user advances while zoomed
    if (state.zoomOpen && lightboxImg) {
      lightboxImg.src = scene.posterSrc;
      lightboxImg.alt = scene.posterAlt;
      if (lightboxCaption) lightboxCaption.textContent = scene.zoomCaption;
    }

    // Sync Reveal.js slide index without recursion
    if (deck.getIndices().h !== scene.index) {
      isSyncingReveal = true;
      deck.slide(scene.index);
      isSyncingReveal = false;
    }

    backdrop.setScene(scene.index);

    if (animate && fromIndex !== scene.index) {
      motion.playSceneTransition(fromIndex, scene.index);
    }

    return { ...state };
  }

  function parseSceneIndex(target) {
    if (typeof target === 'number' && !Number.isNaN(target)) {
      return Math.max(0, Math.min(totalScenes - 1, Math.floor(target)));
    }
    if (typeof target === 'string') {
      const byId = SCENES.findIndex((s) => s.sceneId === target || s.posterIndex === target);
      if (byId !== -1) return byId;
      const numeric = parseInt(target, 10);
      if (!Number.isNaN(numeric)) {
        // Support 1-based strings like "01".."05" or 0-based "0".."4"
        const zeroBased = numeric >= 1 && numeric <= totalScenes && target.length >= 2 ? numeric - 1 : numeric;
        return Math.max(0, Math.min(totalScenes - 1, zeroBased));
      }
    }
    return 0;
  }

  function goToScene(target) {
    const nextIdx = parseSceneIndex(target);
    const prevIdx = state.sceneIndex;
    return renderScene(nextIdx, { animate: prevIdx !== nextIdx, fromIndex: prevIdx });
  }

  function nextScene() {
    if (state.sceneIndex < totalScenes - 1) {
      return goToScene(state.sceneIndex + 1);
    }
    return { ...state };
  }

  function prevScene() {
    if (state.sceneIndex > 0) {
      return goToScene(state.sceneIndex - 1);
    }
    return { ...state };
  }

  function toggleNotes(forceOpen) {
    state.notesOpen = typeof forceOpen === 'boolean' ? forceOpen : !state.notesOpen;
    if (speakerCuePanel) {
      speakerCuePanel.classList.toggle('is-collapsed', !state.notesOpen);
      speakerCuePanel.setAttribute('aria-hidden', state.notesOpen ? 'false' : 'true');
    }
    if (btnNotes) {
      btnNotes.classList.toggle('active', state.notesOpen);
      btnNotes.setAttribute('aria-pressed', state.notesOpen ? 'true' : 'false');
    }
    if (btnCollapseCue) {
      btnCollapseCue.textContent = state.notesOpen ? 'Thu gọn' : 'Mở';
    }
    return state.notesOpen;
  }

  function toggleLiteMode(forceLite) {
    state.liteMode = typeof forceLite === 'boolean' ? forceLite : !state.liteMode;
    document.body.classList.toggle('lite-mode', state.liteMode);
    backdrop.setLiteMode(state.liteMode);
    motion.setDisabled(state.liteMode || prefersReduced);
    if (btnLite) {
      btnLite.classList.toggle('active', state.liteMode);
      btnLite.setAttribute('aria-pressed', state.liteMode ? 'true' : 'false');
    }
    return state.liteMode;
  }

  function toggleZoom(forceOpen) {
    const nextOpen = typeof forceOpen === 'boolean' ? forceOpen : !state.zoomOpen;
    state.zoomOpen = nextOpen;
    const scene = SCENES[state.sceneIndex] || SCENES[0];
    if (lightboxModal && lightboxImg) {
      if (nextOpen) {
        lightboxImg.src = scene.posterSrc;
        lightboxImg.alt = scene.posterAlt;
        if (lightboxCaption) lightboxCaption.textContent = scene.zoomCaption;
      }
      lightboxModal.classList.toggle('active', nextOpen);
      lightboxModal.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    }
    if (btnZoom) {
      btnZoom.classList.toggle('active', nextOpen);
      btnZoom.setAttribute('aria-pressed', nextOpen ? 'true' : 'false');
    }
    return state.zoomOpen;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // Reveal sync listeners (e.g., Overview mode click or programmatic Reveal.slide)
  deck.on('slidechanged', (event) => {
    if (!isSyncingReveal && typeof event.indexh === 'number' && event.indexh !== state.sceneIndex) {
      renderScene(Math.max(0, Math.min(totalScenes - 1, event.indexh)), {
        animate: true,
        fromIndex: state.sceneIndex
      });
    }
  });

  deck.on('overviewshown', () => {
    document.body.classList.add('overview-open');
    document.getElementById('nq57-reveal')?.setAttribute('aria-hidden', 'false');
  });

  deck.on('overviewhidden', () => {
    document.body.classList.remove('overview-open');
    document.getElementById('nq57-reveal')?.setAttribute('aria-hidden', 'true');
  });

  // UI Event bindings
  btnPrev?.addEventListener('click', () => prevScene());
  btnNext?.addEventListener('click', () => nextScene());
  btnRestart?.addEventListener('click', () => goToScene(0));
  btnNotes?.addEventListener('click', () => toggleNotes());
  btnCollapseCue?.addEventListener('click', () => toggleNotes());
  btnLite?.addEventListener('click', () => toggleLiteMode());
  btnZoom?.addEventListener('click', () => toggleZoom());
  btnFullscreen?.addEventListener('click', () => toggleFullscreen());

  posterFrame?.addEventListener('click', () => toggleZoom(true));
  closeLightboxBtn?.addEventListener('click', () => toggleZoom(false));
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) toggleZoom(false);
  });

  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-scene-pill'), 10);
      goToScene(idx);
    });
  });

  document.querySelectorAll('#nq57-reveal section').forEach((sec) => {
    sec.addEventListener('click', () => {
      if (deck.isOverview()) {
        const idx = parseInt(sec.getAttribute('data-scene-index'), 10);
        deck.toggleOverview(false);
        goToScene(idx);
      }
    });
  });

  document.addEventListener('fullscreenchange', () => {
    state.isFullscreen = Boolean(document.fullscreenElement);
    if (btnFullscreen) {
      btnFullscreen.classList.toggle('active', state.isFullscreen);
      btnFullscreen.setAttribute('aria-pressed', state.isFullscreen ? 'true' : 'false');
    }
  });

  // Keyboard bindings (ignoring modified OS shortcuts like Ctrl+R / Ctrl+L)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      if (e.key === ' ' && activeTag === 'A') return;
      e.preventDefault();
      if (e.key === ' ' && activeTag === 'BUTTON') {
        document.activeElement.blur();
      }
      nextScene();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevScene();
    } else if (e.key === 'Home' || e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      goToScene(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToScene(totalScenes - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      toggleNotes();
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      toggleLiteMode();
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      toggleZoom();
    } else if (e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      if (state.zoomOpen) toggleZoom(false);
      deck.toggleOverview();
    } else if (e.key === 'Escape') {
      if (state.zoomOpen) {
        e.preventDefault();
        toggleZoom(false);
      } else if (deck.isOverview()) {
        e.preventDefault();
        deck.toggleOverview(false);
      }
    }
  });

  // Sync initial UI state (Scene 01/05 immediately visible)
  if (btnLite && state.liteMode) {
    btnLite.classList.add('active');
    btnLite.setAttribute('aria-pressed', 'true');
  }
  renderScene(0, { animate: false, fromIndex: 0 });

  const api = {
    getState: () => ({ ...state }),
    goToScene,
    nextScene,
    prevScene,
    toggleNotes,
    toggleLiteMode,
    toggleZoom
  };
  window.__NQ57_DECK__ = api;

  return {
    ...api,
    deck,
    backdrop,
    motion
  };
}
