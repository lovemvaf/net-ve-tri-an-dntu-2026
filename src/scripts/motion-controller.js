import gsap from 'gsap';

/**
 * THEMATIC GSAP TRANSITION DIRECTOR — 05 SCENES (0.55–0.85s)
 * Transitions stay calm, dignified, and single-concept, leaving the poster
 * 100% still afterward for effortless reading and reliable QR scanning.
 */
export function createMotionController() {
  let activeTimeline = null;
  let isLiteOrReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  function killActive() {
    if (activeTimeline) {
      const tl = activeTimeline;
      activeTimeline = null;
      tl.progress(1);
      tl.kill();
    }
  }

  function settleInstant(posterFrame, railContent, veilEl, rippleEl) {
    if (posterFrame) gsap.set(posterFrame, { clearProps: 'transform,opacity,filter' });
    if (railContent) gsap.set(railContent, { clearProps: 'transform,opacity' });
    if (veilEl) gsap.set(veilEl, { autoAlpha: 0, clearProps: 'transform' });
    if (rippleEl) gsap.set(rippleEl, { autoAlpha: 0, clearProps: 'transform' });
  }

  /**
   * Plays a thematic single-concept transition between scenes:
   * - 0 <-> 1: notebook / idea slide
   * - 1 <-> 2: warm golden settle
   * - 2 <-> 3: gentle expansion reveal
   * - 3 <-> 4: dignified ripple settle
   */
  function playSceneTransition(fromIndex, toIndex) {
    killActive();

    const posterFrame = document.getElementById('poster-museum-frame');
    const railCard = document.getElementById('rail-narrative-card');
    const veilEl = document.getElementById('transition-veil');
    const rippleEl = document.getElementById('transition-ripple');

    if (isLiteOrReduced || !posterFrame) {
      settleInstant(posterFrame, railCard, veilEl, rippleEl);
      return Promise.resolve('instant');
    }

    const direction = toIndex >= fromIndex ? 1 : -1;
    const pairKey = `${Math.min(fromIndex, toIndex)}-${Math.max(fromIndex, toIndex)}`;

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          settleInstant(posterFrame, railCard, veilEl, rippleEl);
          if (activeTimeline === tl) activeTimeline = null;
          resolve('completed');
        }
      });
      activeTimeline = tl;

      if (pairKey === '0-1') {
        // 01 -> 02: Notebook / idea horizontal glide (0.64s)
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.72, x: direction * 26 },
          { autoAlpha: 1, x: 0, duration: 0.64, clearProps: 'transform,opacity' },
          0
        );
        if (veilEl) {
          tl.fromTo(
            veilEl,
            { autoAlpha: 0.34, xPercent: direction * -18 },
            { autoAlpha: 0, xPercent: direction * 18, duration: 0.6, clearProps: 'transform' },
            0
          );
        }
      } else if (pairKey === '1-2') {
        // 02 -> 03: Warm golden settle (0.72s)
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.68, y: direction * 14, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, clearProps: 'transform,opacity' },
          0
        );
        if (veilEl) {
          tl.fromTo(
            veilEl,
            { autoAlpha: 0.38 },
            { autoAlpha: 0, duration: 0.72 },
            0
          );
        }
      } else if (pairKey === '2-3') {
        // 03 -> 04: Gentle expansion reveal (0.68s)
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.74, scale: 0.968 },
          { autoAlpha: 1, scale: 1, duration: 0.68, clearProps: 'transform,opacity' },
          0
        );
      } else if (pairKey === '3-4') {
        // 04 -> 05: Dignified ripple settle (0.80s)
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.76, scale: 1.018 },
          { autoAlpha: 1, scale: 1, duration: 0.78, clearProps: 'transform,opacity' },
          0
        );
        if (rippleEl) {
          tl.fromTo(
            rippleEl,
            { autoAlpha: 0.48, scale: 0.78 },
            { autoAlpha: 0, scale: 1.35, duration: 0.82, ease: 'power2.out', clearProps: 'transform' },
            0
          );
        }
      } else {
        // Direct pill jump / Restart / Home / End (0.58s)
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.72, y: 10, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, clearProps: 'transform,opacity' },
          0
        );
      }

      if (railCard) {
        tl.fromTo(
          railCard,
          { autoAlpha: 0.58, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.55, clearProps: 'transform,opacity' },
          0.04
        );
      }
    });
  }

  function setDisabled(disabled) {
    isLiteOrReduced = Boolean(disabled);
    if (isLiteOrReduced) killActive();
  }

  return {
    playSceneTransition,
    setDisabled,
    killActive
  };
}
