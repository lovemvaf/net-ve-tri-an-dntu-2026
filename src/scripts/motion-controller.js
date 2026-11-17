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
  let transitionResolve = null;
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

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
  // V10 SMOOTH & ELEGANT TRANSITION DIRECTOR (PROMISE-SYNCHRONIZED, WIRE-FREE)
  // ===========================================================================
  function playInterSlideTransition(fromSlide, toSlide, toStep = 0) {
    const overlay = document.getElementById('scene-transition-overlay');
    const veilBackdrop = document.getElementById('transition-veil-backdrop');
    const dawnBloom = document.getElementById('transition-dawn-bloom');
    const pageWave = document.getElementById('transition-page-wave');
    const curtainL = document.getElementById('transition-curtain-left');
    const curtainR = document.getElementById('transition-curtain-right');

    if (transitionTimeline) {
      transitionTimeline.kill();
      transitionTimeline = null;
    }
    if (transitionResolve) {
      const prevRes = transitionResolve;
      transitionResolve = null;
      prevRes('cancelled');
    }

    if (!overlay || isReducedMotion) {
      return Promise.resolve('instant');
    }

    // Identify the thematic connection between slides (Section IX.B)
    let theme = 'floral-light-gateway';
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
      theme = 'bouquet-of-gratitude'; // 6. Slide 05 -> Slide 06 (Grand Moment 02)
    } else if (fromSlide === 5 && toSlide === 5 && toStep === 1) {
      theme = 'grand-tribute-reveal'; // 7. Slide 06 -> Finale (Grand Moment 03)
    }

    overlay.setAttribute('data-transition-theme', theme);

    // Reset all soft transition layers
    gsap.set([veilBackdrop, dawnBloom, pageWave], { autoAlpha: 0, xPercent: 0, yPercent: 0, scale: 1 });
    gsap.set([curtainL, curtainR], { autoAlpha: 0, xPercent: 0 });

    return new Promise((resolve) => {
      transitionResolve = resolve;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          if (transitionResolve === resolve) transitionResolve = null;
          resolve('completed');
        }
      });
      transitionTimeline = tl;

      gsap.set(overlay, { autoAlpha: 1 });

      if (theme === 'grand-tribute-reveal') {
        // GRAND MOMENT 03 — Full Poster Finale: Soft Dawn Curtains Part + Sunrise Horizon Bloom
        gsap.set([curtainL, curtainR], { autoAlpha: 0.78, xPercent: 0 });
        gsap.set(dawnBloom, { autoAlpha: 0.65, scale: 0.92 });
        tl.to(
          curtainL,
          { xPercent: -100, autoAlpha: 0, duration: 0.52, ease: 'cinematicOut' },
          0
        )
          .to(
            curtainR,
            { xPercent: 100, autoAlpha: 0, duration: 0.52, ease: 'cinematicOut' },
            0
          )
          .to(
            dawnBloom,
            { autoAlpha: 0, scale: 1.08, duration: 0.54, ease: 'power2.out' },
            0
          );
      } else if (theme === 'bouquet-of-gratitude') {
        // GRAND MOMENT 02 — Slide 05 -> Slide 06: Warm Golden-Blush Tribute Glow
        gsap.set(dawnBloom, { autoAlpha: 0.62, scale: 0.94 });
        gsap.set(veilBackdrop, { autoAlpha: 0.42 });
        tl.to(
          [dawnBloom, veilBackdrop],
          { autoAlpha: 0, scale: 1.04, duration: 0.50, ease: 'power2.out' },
          0
        );
      } else if (theme === 'book-of-knowledge') {
        // Slide 02 -> Slide 03: Soft Page-Light Wave Opening From Left to Right
        gsap.set(pageWave, { autoAlpha: 0.58, xPercent: -35 });
        tl.to(
          pageWave,
          { xPercent: 35, autoAlpha: 0, duration: 0.46, ease: 'cinematicOut' },
          0
        );
      } else {
        // Standard Soft Atmospheric Dissolve Veil (Calm, comfortable, zero visual noise)
        gsap.set(veilBackdrop, { autoAlpha: 0.45 });
        gsap.set(dawnBloom, { autoAlpha: 0.35, yPercent: theme === 'stairway-to-tomorrow' ? 12 : 0 });
        tl.to(
          [veilBackdrop, dawnBloom],
          { autoAlpha: 0, yPercent: 0, duration: 0.42, ease: 'power2.out' },
          0
        );
      }

      tl.to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.14,
          ease: 'power2.out'
        },
        0.32
      );
    });
  }

  // ===========================================================================
  // LANDING PAGE — GRAND MOMENT 01: THE SKY OF GRATITUDE (1 Unified State)
  // ===========================================================================
  function applyLandingStep(stepIndex = 0) {
    killActiveTimeline();
    const landing = document.getElementById('landing-page');
    if (!landing) return;

    landing.setAttribute('data-active-step', String(stepIndex));

    const dateBadge = landing.querySelector('#landing-date-badge');
    const eyebrow2011 = landing.querySelector('#landing-2011-eyebrow');
    const bouquetGroup = landing.querySelector('#landing-floral-bouquet');
    const posterContainer = landing.querySelector('#landing-poster-container');
    const posterImg = landing.querySelector('#landing-full-poster-img');
    const titleGroup = landing.querySelector('#landing-title-group');
    const ctaGroup = landing.querySelector('#landing-cta-group');
    const aura = landing.querySelector('.landing-poster-aura');

    if (posterImg) gsap.set(posterImg, { clearProps: 'transform' });

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    tl.fromTo(
      [dateBadge, eyebrow2011],
      { autoAlpha: 0.3, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.52), clearProps: 'transform' },
      0
    )
      .fromTo(
        bouquetGroup,
        { autoAlpha: 0.35, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: dur(0.56), clearProps: 'transform' },
        0.05
      )
      .fromTo(
        [aura, posterContainer],
        { autoAlpha: 0.4, scale: 0.985 },
        { autoAlpha: 1, scale: 1, duration: dur(0.62), clearProps: 'transform' },
        0.08
      )
      .fromTo(
        [titleGroup, ctaGroup],
        { autoAlpha: 0.35, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.56), clearProps: 'transform' },
        0.12
      );

    const btnEnter = document.getElementById('btn-enter-journey');
    btnEnter?.classList.add('pulse-ready');
  }

  // ===========================================================================
  // SLIDE 01 — KHỞI NGUỒN (1 Unified State)
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
      { autoAlpha: 0.4, y: 10 },
      { autoAlpha: 1, y: 0, duration: dur(0.52), clearProps: 'transform' },
      0
    )
      .fromTo(
        arcCards,
        { autoAlpha: 0.3, y: 10 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
        0.06
      )
      .fromTo(
        [poemStrip, codePill],
        { autoAlpha: 0.35, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0.14
      );
  }

  // ===========================================================================
  // SLIDE 02 — NGƯỜI THẦY (1 Unified State — Warm, Emotional, Dignified)
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
      gsap.set(lightPath, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.65 });
      tl.to(lightPath, { strokeDashoffset: 0, duration: dur(0.65) }, 0);
    }

    tl.fromTo(
      [titleEl, ...cropCards],
      { autoAlpha: 0.45, y: 8 },
      { autoAlpha: 1, y: 0, stagger: dur(0.05), duration: dur(0.5), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.3, x: 10 },
        { autoAlpha: 1, x: 0, stagger: dur(0.07), duration: dur(0.48), clearProps: 'transform' },
        0.07
      )
      .fromTo(
        floralAccent,
        { autoAlpha: 0.35, y: 6 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0.15
      );
  }

  // ===========================================================================
  // SLIDE 03 — CON THUYỀN TRI THỨC (4 Camera Zones — Clean Artwork, No Wires)
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
          duration: dur(0.75)
        },
        0
      );
    }

    if (focalInset) {
      tl.to(
        focalInset,
        {
          autoAlpha: stepIndex < 3 ? 1 : 0,
          y: stepIndex < 3 ? 0 : 8,
          duration: dur(0.4)
        },
        0
      );
    }

    if (spotlightCard) {
      tl.fromTo(
        spotlightCard,
        { autoAlpha: 0.55, y: 6 },
        { autoAlpha: 1, y: 0, duration: dur(0.42), clearProps: 'transform' },
        0
      );
    }
  }

  // ===========================================================================
  // SLIDE 04 — SINH VIÊN 5 TỐT (1 Unified State — Clean, Dignified, No Dashed Wire)
  // ===========================================================================
  function applySlide4Step(slideEl, stepIndex = 0) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const titleEl = slideEl.querySelector('.display-serif-title');
    const journeyBox = slideEl.querySelector('.personal-journey-box');
    const cards = slideEl.querySelectorAll('.criteria-pillar-card');
    const culminationBar = slideEl.querySelector('.milestone-culmination-bar');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    cards.forEach((card) => card.classList.add('criteria-active'));

    tl.fromTo(
      [titleEl, journeyBox],
      { autoAlpha: 0.4, y: 8 },
      { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
      0
    )
      .fromTo(
        cards,
        { autoAlpha: 0.3, y: 10 },
        { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.5), clearProps: 'transform' },
        0.05
      )
      .fromTo(
        culminationBar,
        { autoAlpha: 0.35, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0.16
      );
  }

  // ===========================================================================
  // SLIDE 05 — HÀNH TRÌNH THỰC TẾ (3 Stages — Smooth Editorial Photo Transitions)
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
        { autoAlpha: 0.48, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0
      ).fromTo(
        sideCards,
        { autoAlpha: 0.45, x: 10 },
        { autoAlpha: 1, x: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
        0.04
      );
    }
  }

  // ===========================================================================
  // SLIDE 06 — GRAND MOMENT 02 (TRIBUTE) & GRAND MOMENT 03 (FULL POSTER FINALE)
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
      // GRAND MOMENT 02 — A Thousand Thank-Yous (Teacher Gratitude & 20/11 Floral Gift)
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');

      tl.fromTo(
        [tributeList, teacherStage],
        { autoAlpha: 0.4, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.52), clearProps: 'transform' },
        0
      )
        .fromTo(
          pillars,
          { autoAlpha: 0.35, y: 6 },
          { autoAlpha: 1, y: 0, stagger: dur(0.06), duration: dur(0.48), clearProps: 'transform' },
          0.05
        )
        .fromTo(
          [closingQuote, floralTribute],
          { autoAlpha: 0.35, y: 6 },
          { autoAlpha: 1, y: 0, duration: dur(0.5), clearProps: 'transform' },
          0.12
        );
    } else {
      // GRAND MOMENT 03 — Beyond the Horizon (Full Uncropped Poster Reveal -> Calm Final Hold)
      tributeView?.classList.add('hidden');
      finaleView?.classList.add('active');

      if (finalePosterImg) gsap.set(finalePosterImg, { clearProps: 'transform' });

      tl.fromTo(
        finaleView,
        { autoAlpha: 0.35 },
        { autoAlpha: 1, duration: dur(0.58), clearProps: 'transform' },
        0
      )
        .fromTo(
          finalePosterFrame,
          { scale: 1.025 },
          { scale: 1, duration: dur(0.68), clearProps: 'transform' },
          0
        )
        .fromTo(
          [finaleLeftWing, finaleHoldBadge],
          { autoAlpha: 0.38, y: 8 },
          { autoAlpha: 1, y: 0, duration: dur(0.54), clearProps: 'transform' },
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
