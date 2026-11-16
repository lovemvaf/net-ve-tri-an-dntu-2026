import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Flip } from 'gsap/Flip';
import { SLIDE3_ZONES, SLIDE5_SCENES } from '../content/presentation-data.js';

gsap.registerPlugin(SplitText, CustomEase, MorphSVGPlugin, Flip);
CustomEase.create('cinematicOut', '0.16, 1, 0.3, 1');
CustomEase.create('softInOut', '0.65, 0, 0.35, 1');

export function createMotionController() {
  let activeTimeline = null;
  let transitionTimeline = null;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let lastSlide5Scene = -1;

  function killActiveTimeline() {
    if (activeTimeline) {
      activeTimeline.progress(1);
      activeTimeline.kill();
      activeTimeline = null;
    }
  }

  function dur(seconds) {
    return isReducedMotion ? 0.01 : seconds;
  }

  function playInterSlideTransition(fromSlide, toSlide, onMidpoint) {
    const overlay = document.getElementById('scene-transition-overlay');
    const pathEl = document.getElementById('transition-light-path');
    if (!overlay || !pathEl || isReducedMotion) {
      onMidpoint?.();
      return Promise.resolve();
    }

    if (transitionTimeline) transitionTimeline.kill();

    return new Promise((resolve) => {
      const len = pathEl.getTotalLength ? pathEl.getTotalLength() : 1600;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          resolve();
        }
      });
      transitionTimeline = tl;

      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });

      tl.to(pathEl, {
        strokeDashoffset: 0,
        duration: 0.32,
        ease: 'softInOut',
        onComplete: () => {
          onMidpoint?.();
        }
      }).to(overlay, {
        autoAlpha: 0,
        duration: 0.22,
        ease: 'power2.out'
      });
    });
  }

  // ===========================================================================
  // LANDING PAGE — 1 UNIFIED STATE (All elements auto-animate in ~0.85s)
  // ===========================================================================
  function applyLandingStep(stepIndex = 0) {
    killActiveTimeline();
    const landing = document.getElementById('landing-page');
    if (!landing) return;

    landing.setAttribute('data-active-step', String(stepIndex));

    const penStroke = landing.querySelector('#landing-pen-stroke');
    const dateBadge = landing.querySelector('#landing-date-badge');
    const eyebrow2011 = landing.querySelector('#landing-2011-eyebrow');
    const petalsGroup = landing.querySelector('#landing-floating-petals');
    const bouquetGroup = landing.querySelector('#landing-floral-bouquet');
    const posterContainer = landing.querySelector('#landing-poster-container');
    const posterImg = landing.querySelector('#landing-full-poster-img');
    const titleGroup = landing.querySelector('#landing-title-group');
    const ctaGroup = landing.querySelector('#landing-cta-group');
    const aura = landing.querySelector('.landing-poster-aura');

    if (posterImg) gsap.set(posterImg, { clearProps: 'transform' });

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (penStroke) {
      const len = penStroke.getTotalLength ? penStroke.getTotalLength() : 500;
      gsap.set(penStroke, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 1 });
      tl.to(penStroke, { strokeDashoffset: 0, duration: dur(0.65), ease: 'softInOut' }, 0);
    }

    tl.fromTo(
      [dateBadge, eyebrow2011, petalsGroup],
      { autoAlpha: 0.2, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
      0.04
    )
      .fromTo(
        bouquetGroup,
        { autoAlpha: 0.25, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: dur(0.52), clearProps: 'transform' },
        0.08
      )
      .fromTo(
        [aura, posterContainer],
        { autoAlpha: 0.35, scale: 0.98 },
        { autoAlpha: 1, scale: 1, duration: dur(0.55), clearProps: 'transform' },
        0.1
      )
      .fromTo(
        [titleGroup, ctaGroup],
        { autoAlpha: 0.3, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.52), clearProps: 'transform' },
        0.14
      );

    const btnEnter = document.getElementById('btn-enter-journey');
    btnEnter?.classList.add('pulse-ready');
  }

  // ===========================================================================
  // SLIDE 01 — 1 UNIFIED STATE (Title, Poster, 4 Chapters & Poem Auto-Animate)
  // ===========================================================================
  function applySlide1Step(slideEl, stepIndex = 0) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const codePill = slideEl.querySelector('.hero-code-pill');
    const quoteCard = slideEl.querySelector('.editorial-quote-card');
    const arcCards = slideEl.querySelectorAll('.arc-step-card');
    const poemStrip = slideEl.querySelector('.hero-poem-strip');
    const posterStage = slideEl.querySelector('.hero-poster-stage');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    tl.fromTo(
      [quoteCard, posterStage],
      { autoAlpha: 0.35, y: 10 },
      { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
      0
    )
      .fromTo(
        arcCards,
        { autoAlpha: 0.25, y: 10 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.45), clearProps: 'transform' },
        0.08
      )
      .fromTo(
        [poemStrip, codePill],
        { autoAlpha: 0.3, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
        0.16
      );
  }

  // ===========================================================================
  // SLIDE 02 — 1 UNIFIED STATE (Teacher Art, Cô Liệu Memory & 20/11 Floral Badge)
  // ===========================================================================
  function applySlide2Step(slideEl, stepIndex = 0) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const cards = slideEl.querySelectorAll('.memory-card-light');
    const cropCards = slideEl.querySelectorAll('.teacher-main-crop-card');
    const floralAccent = slideEl.querySelector('.slide2-floral-badge');
    const lightPath = slideEl.querySelector('.svg-draw-path');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (lightPath) {
      const len = lightPath.getTotalLength ? lightPath.getTotalLength() : 300;
      gsap.set(lightPath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(lightPath, { strokeDashoffset: 0, duration: dur(0.6) }, 0);
    }

    tl.fromTo(
      cropCards,
      { autoAlpha: 0.4, y: 8 },
      { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.25, x: 10 },
        { autoAlpha: 1, x: 0, stagger: dur(0.07), duration: dur(0.45), clearProps: 'transform' },
        0.08
      )
      .fromTo(
        floralAccent,
        { autoAlpha: 0.25, y: 6 },
        { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
        0.18
      );
  }

  // ===========================================================================
  // SLIDE 03 — 4 SEQUENTIAL CAMERA ZONES (0..3)
  // ===========================================================================
  function applySlide3Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const stage = document.getElementById('slide3-camera-target');
    const focalInset = document.getElementById('slide3-focal-inset');
    const detailImg = document.getElementById('slide3-detail-crop');
    const stepBadge = document.getElementById('slide3-step-badge');
    const detailCaption = document.getElementById('slide3-detail-caption');
    const detailQuote = document.getElementById('slide3-detail-quote');
    const detailSub = document.getElementById('slide3-detail-sub');
    const detailTag = document.getElementById('slide3-detail-tag');
    const spotlightCard = document.getElementById('slide3-active-spotlight');
    const tabs = slideEl.querySelectorAll('.zone-tab-btn');

    const z = SLIDE3_ZONES[stepIndex] || SLIDE3_ZONES[0];
    tabs.forEach((btn, idx) => btn.classList.toggle('active', idx === stepIndex));

    if (stepBadge) stepBadge.textContent = z.stepBadge;
    if (detailCaption) detailCaption.textContent = z.title;
    if (detailQuote) detailQuote.textContent = z.quote;
    if (detailSub) detailSub.textContent = z.description;
    if (detailTag) detailTag.textContent = `✦ ${z.highlightTag}`;
    if (detailImg) {
      detailImg.src = z.cropSrc;
      detailImg.alt = z.title;
    }
    if (focalInset) {
      focalInset.setAttribute('data-lightbox-src', z.cropSrc);
      focalInset.setAttribute('data-lightbox-caption', z.title);
    }

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stage) {
      tl.to(
        stage,
        {
          scale: isReducedMotion ? 1 : z.camera.scale,
          xPercent: isReducedMotion ? 0 : z.camera.xPercent,
          yPercent: isReducedMotion ? 0 : z.camera.yPercent,
          duration: dur(0.65)
        },
        0
      );
    }

    if (focalInset) {
      tl.to(
        focalInset,
        {
          autoAlpha: stepIndex < 3 ? 1 : 0,
          y: stepIndex < 3 ? 0 : 10,
          duration: dur(0.38)
        },
        0
      );
    }

    if (spotlightCard) {
      tl.fromTo(
        spotlightCard,
        { autoAlpha: 0.5, y: 6 },
        { autoAlpha: 1, y: 0, duration: dur(0.38), clearProps: 'transform' },
        0
      );
    }
  }

  // ===========================================================================
  // SLIDE 04 — 1 UNIFIED STATE (All 5 Criteria & 02-Year Milestone Auto-Illuminate)
  // ===========================================================================
  function applySlide4Step(slideEl, stepIndex = 0) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const journeyBox = slideEl.querySelector('.personal-journey-box');
    const cards = slideEl.querySelectorAll('.criteria-pillar-card');
    const connectorPath = slideEl.querySelector('.criteria-connector-svg .svg-draw-path');
    const culminationBar = slideEl.querySelector('.milestone-culmination-bar');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (connectorPath) {
      const len = 1380;
      gsap.set(connectorPath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(connectorPath, { strokeDashoffset: 0, duration: dur(0.65) }, 0.05);
    }

    cards.forEach((card) => card.classList.add('criteria-active'));

    tl.fromTo(
      journeyBox,
      { autoAlpha: 0.35, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.25, y: 12 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
        0.06
      )
      .fromTo(
        culminationBar,
        { autoAlpha: 0.3, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0.2
      );
  }

  // ===========================================================================
  // SLIDE 05 — 3 CONSOLIDATED STAGES (0..2 · 4 Real Photos per Stage)
  // ===========================================================================
  function applySlide5Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const scene = SLIDE5_SCENES[stepIndex] || SLIDE5_SCENES[0];
    document.querySelectorAll('[data-slide5-scene]').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === stepIndex);
    });

    const stage = document.getElementById('slide5-exhibition-stage');
    const heroCard = slideEl.querySelector('.exhibition-hero-card');
    const sideCards = slideEl.querySelectorAll('.exhibition-side-card');

    const eyebrow = document.getElementById('s5-scene-eyebrow');
    const headline = document.getElementById('s5-scene-headline');
    const heroImg = document.getElementById('s5-hero-img');
    const heroBadge = document.getElementById('s5-hero-badge');
    const heroTitle = document.getElementById('s5-hero-title');
    const heroCap = document.getElementById('s5-hero-caption');

    if (eyebrow) eyebrow.textContent = scene.eyebrow;
    if (headline && scene.headline) headline.textContent = scene.headline;
    if (heroImg) {
      heroImg.src = scene.hero.src;
      heroImg.alt = scene.hero.title;
    }
    if (heroBadge) heroBadge.textContent = scene.hero.badge;
    if (heroTitle) heroTitle.textContent = scene.hero.title;
    if (heroCap) heroCap.textContent = scene.hero.caption;

    [1, 2, 3].forEach((slotNum, idx) => {
      const sp = scene.sidePhotos[idx];
      if (!sp) return;
      const sImg = document.getElementById(`s5-side${slotNum}-img`);
      const sBadge = document.getElementById(`s5-side${slotNum}-badge`);
      const sTitle = document.getElementById(`s5-side${slotNum}-title`);
      const sCap = document.getElementById(`s5-side${slotNum}-caption`);
      if (sImg) {
        sImg.src = sp.src;
        sImg.alt = sp.title;
      }
      if (sBadge) sBadge.textContent = sp.badge;
      if (sTitle) sTitle.textContent = sp.title;
      if (sCap) sCap.textContent = sp.caption;
    });

    heroCard?.classList.toggle('achievement-gold-frame', !!scene.isAchievementHighlight);

    if (!isReducedMotion && lastSlide5Scene !== stepIndex && stage) {
      const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
      activeTimeline = tl;
      tl.fromTo(
        heroCard,
        { autoAlpha: 0.45, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
        0
      ).fromTo(
        sideCards,
        { autoAlpha: 0.45, x: 10 },
        { autoAlpha: 1, x: 0, stagger: dur(0.06), duration: dur(0.45), clearProps: 'transform' },
        0.04
      );
    }
    lastSlide5Scene = stepIndex;
  }

  // ===========================================================================
  // SLIDE 06 — 2 CLEAN STATES (0: Lời Tri Ân, 1: Toàn Bộ Poster Kết)
  // ===========================================================================
  function applySlide6Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const tributeView = document.getElementById('slide6-tribute-view');
    const finaleView = document.getElementById('slide6-finale-view');
    const teacherStage = document.getElementById('slide6-teacher-visual-stage');
    const tributeList = document.getElementById('s6-tribute-list');
    const pillars = slideEl.querySelectorAll('.gratitude-pillar-item');
    const closingQuote = slideEl.querySelector('.final-closing-quote');
    const floralTribute = document.getElementById('slide6-floral-tribute');
    const finalePosterFrame = document.getElementById('finale-poster-container');
    const finalePosterImg = document.getElementById('finale-full-poster-img');
    const finaleHoldBadge = document.getElementById('finale-hold-badge');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stepIndex === 0) {
      // State 0: Teacher Gratitude & 20/11 Floral Gift (All auto-animate in 1 cohesive timeline)
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');

      tl.fromTo(
        [tributeList, teacherStage],
        { autoAlpha: 0.35, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0
      )
        .fromTo(
          pillars,
          { autoAlpha: 0.3, y: 6 },
          { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.45), clearProps: 'transform' },
          0.05
        )
        .fromTo(
          [closingQuote, floralTribute],
          { autoAlpha: 0.3, y: 6 },
          { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
          0.12
        );
    } else {
      // State 1: Full Uncropped Poster Finale & Final Hold Message (All settle automatically in 1 timeline)
      tributeView?.classList.add('hidden');
      finaleView?.classList.add('active');

      if (finalePosterImg) gsap.set(finalePosterImg, { clearProps: 'transform' });
      if (finalePosterFrame) gsap.set(finalePosterFrame, { clearProps: 'transform' });

      tl.fromTo(
        finaleView,
        { autoAlpha: 0.25 },
        { autoAlpha: 1, duration: dur(0.55), clearProps: 'transform' },
        0
      ).fromTo(
        finaleHoldBadge,
        { autoAlpha: 0.35, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.5), clearProps: 'transform' },
        0.08
      );
    }
  }

  function applyStep(slideIndex, stepIndex, slideEl) {
    if (slideIndex === -1) {
      applyLandingStep(stepIndex);
    } else if (slideIndex === 0) {
      applySlide1Step(slideEl, stepIndex);
    } else if (slideIndex === 1) {
      applySlide2Step(slideEl, stepIndex);
    } else if (slideIndex === 2) {
      applySlide3Step(slideEl, stepIndex);
    } else if (slideIndex === 3) {
      applySlide4Step(slideEl, stepIndex);
    } else if (slideIndex === 4) {
      applySlide5Step(slideEl, stepIndex);
    } else if (slideIndex === 5) {
      applySlide6Step(slideEl, stepIndex);
    }
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
  }

  return {
    applyStep,
    playInterSlideTransition,
    setReducedMotion,
    killActiveTimeline
  };
}
