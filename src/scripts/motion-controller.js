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

  // ===========================================================================
  // V6 GRAND CINEMATIC INTER-SLIDE TRANSITIONS (7 SIGNATURE CHOREOGRAPHIES)
  // Non-blocking, cancellable on rapid click, 60fps GPU-friendly SVG & CSS
  // ===========================================================================
  function playInterSlideTransition(fromSlide, toSlide, toStep = 0) {
    const overlay = document.getElementById('scene-transition-overlay');
    const pathEl = document.getElementById('transition-light-path');
    const secPathEl = document.getElementById('transition-secondary-path');
    const beamEl = document.getElementById('transition-light-beam');
    const stairsEl = document.getElementById('transition-stair-steps');
    const birdsEl = document.getElementById('transition-birds-group');
    const nodesEl = document.getElementById('transition-criteria-nodes');
    const ribbonEl = document.getElementById('transition-silk-ribbon');
    const petalsEl = document.getElementById('transition-petals-group');
    const curtainL = document.getElementById('transition-curtain-left');
    const curtainR = document.getElementById('transition-curtain-right');
    const veilBackdrop = document.getElementById('transition-veil-backdrop');

    if (!overlay || !pathEl || isReducedMotion) {
      return Promise.resolve();
    }

    if (transitionTimeline) {
      transitionTimeline.kill();
      transitionTimeline = null;
    }

    // Determine which of the 7 signature transitions is playing
    let theme = 'gateway';
    if (fromSlide === -1 && toSlide === 0) {
      theme = 'floral-light-gateway'; // 1. Landing -> Slide 01
    } else if (fromSlide === 0 && toSlide === 1) {
      theme = 'the-first-light';      // 2. Slide 01 -> Slide 02
    } else if (fromSlide === 1 && toSlide === 2) {
      theme = 'book-of-knowledge';    // 3. Slide 02 -> Slide 03
    } else if (fromSlide === 2 && toSlide === 3) {
      theme = 'stairway-to-tomorrow'; // 4. Slide 03 -> Slide 04
    } else if (fromSlide === 3 && toSlide === 4) {
      theme = 'memories-in-motion';   // 5. Slide 04 -> Slide 05
    } else if (fromSlide === 4 && toSlide === 5) {
      theme = 'bouquet-of-gratitude'; // 6. Slide 05 -> Slide 06
    } else if (fromSlide === 5 && toSlide === 5 && toStep === 1) {
      theme = 'grand-tribute-reveal'; // 7. Slide 06 Tribute -> Full Poster Finale
    }

    overlay.setAttribute('data-transition-theme', theme);

    // Reset all sub-elements before starting specific choreography
    gsap.set([beamEl, stairsEl, birdsEl, nodesEl, ribbonEl, petalsEl], {
      autoAlpha: 0,
      x: 0,
      y: 0,
      scale: 1
    });
    gsap.set([curtainL, curtainR], { autoAlpha: 0, xPercent: 0 });
    gsap.set(veilBackdrop, { autoAlpha: 0.45 });

    const len = pathEl.getTotalLength ? pathEl.getTotalLength() : 2200;
    const secLen = secPathEl?.getTotalLength ? secPathEl.getTotalLength() : 2100;
    gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 1 });
    if (secPathEl) {
      gsap.set(secPathEl, { strokeDasharray: secLen, strokeDashoffset: secLen, autoAlpha: 0.75 });
    }

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          resolve();
        }
      });
      transitionTimeline = tl;

      gsap.set(overlay, { autoAlpha: 1 });

      // Base golden light ribbon sweep across all transitions
      tl.to(
        pathEl,
        {
          strokeDashoffset: 0,
          duration: 0.44,
          ease: 'softInOut'
        },
        0
      );
      if (secPathEl) {
        tl.to(
          secPathEl,
          {
            strokeDashoffset: 0,
            duration: 0.48,
            ease: 'softInOut'
          },
          0.03
        );
      }

      // Theme-specific visual choreography
      if (theme === 'floral-light-gateway') {
        // 1. Landing -> Slide 01: Floral Light Gateway (20/11 petals + silk ribbon arc)
        tl.fromTo(
          [petalsEl, ribbonEl],
          { autoAlpha: 0, x: -60, y: 24, scale: 0.92 },
          { autoAlpha: 0.95, x: 50, y: -18, scale: 1.04, duration: 0.48, ease: 'cinematicOut' },
          0
        );
      } else if (theme === 'the-first-light') {
        // 2. Slide 01 -> Slide 02: The First Light (Warm diagonal beam from poster to Teacher)
        tl.fromTo(
          beamEl,
          { autoAlpha: 0, x: 140 },
          { autoAlpha: 0.92, x: -80, duration: 0.46, ease: 'cinematicOut' },
          0
        );
      } else if (theme === 'book-of-knowledge') {
        // 3. Slide 02 -> Slide 03: Book of Knowledge (Curved book-wing light wave + rising birds)
        tl.fromTo(
          [beamEl, birdsEl],
          { autoAlpha: 0, y: 45, scale: 0.94 },
          { autoAlpha: 0.88, y: -25, scale: 1.03, duration: 0.46, ease: 'cinematicOut' },
          0
        );
      } else if (theme === 'stairway-to-tomorrow') {
        // 4. Slide 03 -> Slide 04: Stairway to Tomorrow (Ascending steps + bird flock crossing horizon)
        tl.fromTo(
          stairsEl,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 0.95, y: 0, duration: 0.45, ease: 'cinematicOut' },
          0
        ).fromTo(
          birdsEl,
          { autoAlpha: 0, x: -90, y: 28 },
          { autoAlpha: 0.96, x: 120, y: -22, duration: 0.52, ease: 'cinematicOut' },
          0.02
        );
      } else if (theme === 'memories-in-motion') {
        // 5. Slide 04 -> Slide 05: Memories in Motion (5 golden criteria nodes flowing into gallery)
        tl.fromTo(
          nodesEl,
          { autoAlpha: 0, scale: 0.7, y: 24 },
          { autoAlpha: 0.95, scale: 1.08, y: -12, duration: 0.45, ease: 'cinematicOut' },
          0
        );
      } else if (theme === 'bouquet-of-gratitude') {
        // 6. Slide 05 -> Slide 06: A Bouquet of Gratitude (Silk ribbon + 20/11 rose/chrysanthemum petals)
        tl.fromTo(
          [ribbonEl, petalsEl],
          { autoAlpha: 0, x: -50, y: 30, scale: 0.9 },
          { autoAlpha: 0.98, x: 40, y: -20, scale: 1.06, duration: 0.48, ease: 'cinematicOut' },
          0
        );
      } else if (theme === 'grand-tribute-reveal') {
        // 7. Slide 06 Tribute -> Full Poster Finale: Grand Exhibition Curtains Part + Horizon Bird Flock + Petals
        gsap.set([curtainL, curtainR], { autoAlpha: 0.88, xPercent: 0 });
        tl.to(
          curtainL,
          { xPercent: -100, autoAlpha: 0, duration: 0.58, ease: 'cinematicOut' },
          0
        )
          .to(
            curtainR,
            { xPercent: 100, autoAlpha: 0, duration: 0.58, ease: 'cinematicOut' },
            0
          )
          .fromTo(
            [birdsEl, petalsEl],
            { autoAlpha: 0, x: -70, y: 25, scale: 0.92 },
            { autoAlpha: 0.98, x: 95, y: -24, scale: 1.06, duration: 0.54, ease: 'cinematicOut' },
            0.02
          );
      }

      // Smooth fade-out of the transition overlay
      tl.to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power2.out'
        },
        0.28
      );
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
      { autoAlpha: 0.25, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
      0.03
    )
      .fromTo(
        bouquetGroup,
        { autoAlpha: 0.3, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: dur(0.52), clearProps: 'transform' },
        0.07
      )
      .fromTo(
        [aura, posterContainer],
        { autoAlpha: 0.4, scale: 0.98 },
        { autoAlpha: 1, scale: 1, duration: dur(0.55), clearProps: 'transform' },
        0.09
      )
      .fromTo(
        [titleGroup, ctaGroup],
        { autoAlpha: 0.35, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.52), clearProps: 'transform' },
        0.13
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

    const titleEl = slideEl.querySelector('.display-serif-title');
    const codePill = slideEl.querySelector('.hero-code-pill');
    const quoteCard = slideEl.querySelector('.editorial-quote-card');
    const arcCards = slideEl.querySelectorAll('.arc-step-card');
    const poemStrip = slideEl.querySelector('.hero-poem-strip');
    const posterStage = slideEl.querySelector('.hero-poster-stage');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    tl.fromTo(
      [titleEl, quoteCard, posterStage],
      { autoAlpha: 0.38, y: 10 },
      { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
      0
    )
      .fromTo(
        arcCards,
        { autoAlpha: 0.28, y: 12 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.46), clearProps: 'transform' },
        0.07
      )
      .fromTo(
        [poemStrip, codePill],
        { autoAlpha: 0.32, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
        0.15
      );
  }

  // ===========================================================================
  // SLIDE 02 — 1 UNIFIED STATE (Teacher Art, Cô Liệu Memory & 20/11 Floral Badge)
  // ===========================================================================
  function applySlide2Step(slideEl, stepIndex = 0) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const titleEl = slideEl.querySelector('.display-serif-title');
    const cards = slideEl.querySelectorAll('.memory-card-light');
    const cropCards = slideEl.querySelectorAll('.teacher-main-crop-card');
    const floralAccent = slideEl.querySelector('.slide2-floral-badge');
    const lightPath = slideEl.querySelector('.svg-draw-path');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (lightPath) {
      const len = lightPath.getTotalLength ? lightPath.getTotalLength() : 300;
      gsap.set(lightPath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(lightPath, { strokeDashoffset: 0, duration: dur(0.62) }, 0);
    }

    tl.fromTo(
      [titleEl, ...cropCards],
      { autoAlpha: 0.42, y: 10 },
      { autoAlpha: 1, y: 0, stagger: dur(0.05), duration: dur(0.48), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.28, x: 12 },
        { autoAlpha: 1, x: 0, stagger: dur(0.07), duration: dur(0.46), clearProps: 'transform' },
        0.08
      )
      .fromTo(
        floralAccent,
        { autoAlpha: 0.3, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.45), clearProps: 'transform' },
        0.16
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
    const cameraSvgPath = slideEl.querySelector('#slide3-camera-svg .svg-draw-path');
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

    if (cameraSvgPath && stepIndex === 0) {
      const len = cameraSvgPath.getTotalLength ? cameraSvgPath.getTotalLength() : 620;
      gsap.set(cameraSvgPath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(cameraSvgPath, { strokeDashoffset: 0, duration: dur(0.7) }, 0);
    }

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
        { autoAlpha: 0.52, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.42), clearProps: 'transform' },
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

    const titleEl = slideEl.querySelector('.display-serif-title');
    const journeyBox = slideEl.querySelector('.personal-journey-box');
    const cards = slideEl.querySelectorAll('.criteria-pillar-card');
    const connectorPath = slideEl.querySelector('.criteria-connector-svg .svg-draw-path');
    const culminationBar = slideEl.querySelector('.milestone-culmination-bar');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (connectorPath) {
      const len = 1380;
      gsap.set(connectorPath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(connectorPath, { strokeDashoffset: 0, duration: dur(0.68) }, 0.04);
    }

    cards.forEach((card) => card.classList.add('criteria-active'));

    tl.fromTo(
      [titleEl, journeyBox],
      { autoAlpha: 0.38, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.46), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.28, y: 12 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
        0.06
      )
      .fromTo(
        culminationBar,
        { autoAlpha: 0.32, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0.18
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

    if (!isReducedMotion && stage) {
      const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
      activeTimeline = tl;
      tl.fromTo(
        heroCard,
        { autoAlpha: 0.45, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.46), clearProps: 'transform' },
        0
      ).fromTo(
        sideCards,
        { autoAlpha: 0.42, x: 12 },
        { autoAlpha: 1, x: 0, stagger: dur(0.06), duration: dur(0.46), clearProps: 'transform' },
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
    const finaleLeftWing = slideEl.querySelector('.finale-left-wing');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stepIndex === 0) {
      // State 0: Teacher Gratitude & 20/11 Floral Gift (All auto-animate in 1 cohesive timeline)
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');

      tl.fromTo(
        [tributeList, teacherStage],
        { autoAlpha: 0.38, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0
      )
        .fromTo(
          pillars,
          { autoAlpha: 0.32, y: 8 },
          { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.46), clearProps: 'transform' },
          0.05
        )
        .fromTo(
          [closingQuote, floralTribute],
          { autoAlpha: 0.32, y: 8 },
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
        { autoAlpha: 0.3 },
        { autoAlpha: 1, duration: dur(0.55), clearProps: 'transform' },
        0
      )
        .fromTo(
          [finaleLeftWing, finaleHoldBadge],
          { autoAlpha: 0.35, y: 10 },
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
