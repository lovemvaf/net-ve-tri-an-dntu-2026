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

  // Inter-slide Thematic Light Ribbon Sweep
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
        duration: 0.34,
        ease: 'softInOut',
        onComplete: () => {
          onMidpoint?.();
        }
      }).to(overlay, {
        autoAlpha: 0,
        duration: 0.24,
        ease: 'power2.out'
      });
    });
  }

  // ===========================================================================
  // LANDING PAGE — 5 SEQUENTIAL STEPS (0..4)
  // 0: Mở đầu nét sáng | 1: Ngày Nhà giáo 20/11 | 2: Hoa và lời tri ân |
  // 3: Poster chính nguyên bản | 4: Thông điệp dẫn chuyện & Sẵn sàng
  // ===========================================================================
  function applyLandingStep(stepIndex) {
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

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    // Step 0: Opening calligraphic light stroke
    if (penStroke) {
      const len = penStroke.getTotalLength ? penStroke.getTotalLength() : 500;
      if (stepIndex === 0) {
        gsap.set(penStroke, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 1 });
        tl.to(penStroke, { strokeDashoffset: 0, duration: dur(0.75), ease: 'softInOut' }, 0);
      } else {
        gsap.set(penStroke, { strokeDasharray: len, strokeDashoffset: 0, autoAlpha: 1 });
      }
    }

    // Step 1+: 20/11 Greeting & Floating Petals
    tl.to(
      [dateBadge, eyebrow2011, petalsGroup],
      {
        autoAlpha: stepIndex >= 1 ? 1 : 0.08,
        y: stepIndex >= 1 ? 0 : 12,
        duration: dur(0.5)
      },
      0
    );

    // Step 2+: 20/11 Floral Bouquet & Circuit Stems
    tl.to(
      bouquetGroup,
      {
        autoAlpha: stepIndex >= 2 ? 1 : 0.14,
        scale: stepIndex >= 2 ? 1 : 0.92,
        transformOrigin: 'center bottom',
        duration: dur(0.55)
      },
      0
    );

    // Step 3+: Full Original Poster Reveal (Always object-fit: contain, zero crop)
    if (posterContainer && posterImg) {
      gsap.set(posterImg, { clearProps: 'transform' });
      tl.to(
        aura,
        {
          autoAlpha: stepIndex >= 3 ? 1 : 0.25,
          scale: stepIndex >= 3 ? 1 : 0.85,
          duration: dur(0.55)
        },
        0
      );
      tl.to(
        posterContainer,
        {
          autoAlpha: stepIndex >= 3 ? 1 : 0.18,
          scale: 1,
          duration: dur(0.55),
          clearProps: 'transform'
        },
        0
      );
    }

    // Step 4: Main Title, Slogan, Lead Quote, Right Wing Meta & CTA Button
    tl.to(
      [titleGroup, ctaGroup],
      {
        autoAlpha: stepIndex >= 4 ? 1 : 0.14,
        y: stepIndex >= 4 ? 0 : 12,
        duration: dur(0.5),
        clearProps: stepIndex >= 4 ? 'transform' : ''
      },
      0
    );

    const btnEnter = document.getElementById('btn-enter-journey');
    if (btnEnter) {
      btnEnter.classList.toggle('pulse-ready', stepIndex === 4);
    }
  }

  // ===========================================================================
  // SLIDE 01 — 3 SEQUENTIAL STEPS (0..2)
  // ===========================================================================
  function applySlide1Step(slideEl, stepIndex) {
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

    tl.to(
      [quoteCard, posterStage, codePill],
      {
        autoAlpha: 1,
        y: 0,
        duration: dur(0.45),
        clearProps: 'transform'
      },
      0
    );

    // Step 1+: 4 Chapters illuminate
    tl.to(
      arcCards,
      {
        autoAlpha: stepIndex >= 1 ? 1 : 0.22,
        y: stepIndex >= 1 ? 0 : 10,
        stagger: stepIndex === 1 ? dur(0.07) : 0,
        duration: dur(0.45),
        clearProps: stepIndex >= 1 ? 'transform' : ''
      },
      0
    );
    arcCards.forEach((c) => c.classList.toggle('step-highlighted', stepIndex === 1));

    // Step 2: Poem Strip & Guiding Light
    tl.to(
      poemStrip,
      {
        autoAlpha: stepIndex >= 2 ? 1 : 0.25,
        scale: stepIndex === 2 ? 1.01 : 1,
        duration: dur(0.45),
        clearProps: stepIndex < 2 ? 'transform' : ''
      },
      0
    );
    poemStrip?.classList.toggle('step-highlighted', stepIndex === 2);
  }

  // ===========================================================================
  // SLIDE 02 — 4 SEQUENTIAL STEPS (0..3)
  // ===========================================================================
  function applySlide2Step(slideEl, stepIndex) {
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
      gsap.set(lightPath, { strokeDasharray: len });
      tl.to(lightPath, { strokeDashoffset: 0, duration: dur(0.65) }, 0);
    }

    cards.forEach((card, idx) => {
      const isRevealed = stepIndex >= idx;
      const isFocused = stepIndex === idx || stepIndex === 3;
      tl.to(
        card,
        {
          autoAlpha: isRevealed ? (isFocused ? 1 : 0.62) : 0.18,
          x: isFocused && stepIndex === idx ? 6 : 0,
          duration: dur(0.42)
        },
        0
      );
      card.classList.toggle('step-active-card', stepIndex === idx || stepIndex === 3);
    });

    if (cropCards.length === 2) {
      tl.to(cropCards[0], { scale: stepIndex === 3 ? 1.02 : 1, duration: dur(0.42) }, 0);
      tl.to(cropCards[1], { scale: stepIndex === 0 ? 1.02 : 1, duration: dur(0.42) }, 0);
    }

    if (floralAccent) {
      tl.to(
        floralAccent,
        {
          autoAlpha: stepIndex >= 3 ? 1 : 0.28,
          scale: stepIndex === 3 ? 1.02 : 1,
          duration: dur(0.42)
        },
        0
      );
    }
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
          duration: dur(0.72)
        },
        0
      );
    }

    if (focalInset) {
      // Show high-res focal inset on Zones 0, 1, 2; fade out on Zone 3 (Full Panorama)
      tl.to(
        focalInset,
        {
          autoAlpha: stepIndex < 3 ? 1 : 0,
          y: stepIndex < 3 ? 0 : 10,
          duration: dur(0.42)
        },
        0
      );
    }

    if (spotlightCard) {
      tl.fromTo(
        spotlightCard,
        { autoAlpha: 0.45, y: 8 },
        { autoAlpha: 1, y: 0, duration: dur(0.42), clearProps: 'transform' },
        0
      );
    }
  }

  // ===========================================================================
  // SLIDE 04 — 7 SEQUENTIAL STEPS (0: Động lực, 1..5: 5 Tiêu chí, 6: 02 Năm Liên Tiếp)
  // ===========================================================================
  function applySlide4Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const journeyBox = slideEl.querySelector('.personal-journey-box');
    const cards = slideEl.querySelectorAll('.criteria-pillar-card');
    const connectorPath = slideEl.querySelector('.criteria-connector-svg .svg-draw-path');
    const culminationBar = slideEl.querySelector('.milestone-culmination-bar');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    tl.to(
      journeyBox,
      {
        autoAlpha: 1,
        scale: stepIndex === 0 ? 1.015 : 1,
        duration: dur(0.4)
      },
      0
    );

    if (connectorPath) {
      const len = 1380;
      const progress = Math.max(0, Math.min(1, (stepIndex - 1) / 4));
      gsap.set(connectorPath, { strokeDasharray: len });
      tl.to(
        connectorPath,
        {
          strokeDashoffset: stepIndex === 0 ? len : len * (1 - progress),
          duration: dur(0.45)
        },
        0
      );
    }

    cards.forEach((card, idx) => {
      const criterionStep = idx + 1;
      const isReached = stepIndex >= criterionStep;
      const isCurrent = stepIndex === criterionStep || stepIndex === 6;

      card.classList.toggle('criteria-active', isCurrent);
      tl.to(
        card,
        {
          autoAlpha: isReached ? (isCurrent ? 1 : 0.72) : 0.22,
          y: stepIndex === criterionStep ? -8 : 0,
          scale: stepIndex === criterionStep ? 1.03 : 1,
          duration: dur(0.42)
        },
        0
      );
    });

    tl.to(
      culminationBar,
      {
        autoAlpha: stepIndex >= 6 ? 1 : 0.22,
        y: stepIndex >= 6 ? 0 : 10,
        scale: stepIndex === 6 ? 1.01 : 0.99,
        duration: dur(0.45)
      },
      0
    );
    culminationBar?.classList.toggle('culmination-active', stepIndex === 6);
  }

  // ===========================================================================
  // SLIDE 05 — 5 SEQUENTIAL PHOTO STORYTELLING SCENES (0..4)
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

    const s1Img = document.getElementById('s5-side1-img');
    const s1Badge = document.getElementById('s5-side1-badge');
    const s1Title = document.getElementById('s5-side1-title');
    const s1Cap = document.getElementById('s5-side1-caption');

    const s2Img = document.getElementById('s5-side2-img');
    const s2Badge = document.getElementById('s5-side2-badge');
    const s2Title = document.getElementById('s5-side2-title');
    const s2Cap = document.getElementById('s5-side2-caption');

    if (eyebrow) eyebrow.textContent = scene.eyebrow;
    if (headline && scene.headline) headline.textContent = scene.headline;
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

    heroCard?.classList.toggle('achievement-gold-frame', !!scene.isAchievementHighlight);

    if (!isReducedMotion && lastSlide5Scene !== stepIndex && stage) {
      const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
      activeTimeline = tl;
      tl.fromTo(
        heroCard,
        { autoAlpha: 0.4, y: 10 },
        { autoAlpha: 1, y: 0, duration: dur(0.48), clearProps: 'transform' },
        0
      ).fromTo(
        sideCards,
        { autoAlpha: 0.4, x: 12 },
        { autoAlpha: 1, x: 0, stagger: dur(0.07), duration: dur(0.48), clearProps: 'transform' },
        0.04
      );
    }
    lastSlide5Scene = stepIndex;
  }

  // ===========================================================================
  // SLIDE 06 — 6 SEQUENTIAL STEPS (TEACHER-CENTERED GRAND FINALE)
  // 0: Cảnh A (Lời cảm ơn thầy cô & Hình tượng người thầy)
  // 1: Cảnh B (Ba lời tri ân Cô Liệu, Khoa CNTT, DNTU)
  // 2: Cảnh B/C (Những đóa hoa tri ân 20/11 nở rộ dâng tặng thầy cô)
  // 3: Cảnh C/D (Ánh sáng tri thức tiếp nối mở khung triển lãm)
  // 4: Cảnh E (Toàn bộ Poster nguyên bản xuất hiện trọn vẹn - POSTER_FULLY_VISIBLE)
  // 5: Cảnh F (Final Hold: Tri thức trao đi, tương lai tiếp nối)
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
    const lightBridge = document.getElementById('slide6-light-bridge');
    const finalePosterFrame = document.getElementById('finale-poster-container');
    const finalePosterImg = document.getElementById('finale-full-poster-img');
    const finaleHoldBadge = document.getElementById('finale-hold-badge');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stepIndex <= 3) {
      // Stage 1: Teacher Tribute, 20/11 Floral Gift & Light Continuity Bridge (Steps 0..3)
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');

      if (teacherStage) {
        tl.to(teacherStage, { autoAlpha: 1, y: 0, duration: dur(0.45) }, 0);
      }

      if (tributeList) {
        tl.to(tributeList, { autoAlpha: stepIndex >= 1 ? 1 : 0.32, duration: dur(0.42) }, 0);
      }

      tl.to(
        pillars,
        {
          autoAlpha: stepIndex >= 1 ? 1 : 0.3,
          y: stepIndex >= 1 ? 0 : 6,
          stagger: stepIndex === 1 ? dur(0.07) : 0,
          duration: dur(0.42)
        },
        0
      );

      if (closingQuote) {
        tl.to(closingQuote, { autoAlpha: stepIndex >= 1 ? 1 : 0.35, duration: dur(0.42) }, 0);
      }

      if (floralTribute) {
        tl.to(
          floralTribute,
          {
            autoAlpha: stepIndex >= 2 ? 1 : 0.16,
            scale: stepIndex === 2 ? 1.015 : 1,
            duration: dur(0.48)
          },
          0
        );
        floralTribute.classList.toggle('floral-bloom-active', stepIndex >= 2);
      }

      if (lightBridge) {
        tl.to(
          lightBridge,
          {
            autoAlpha: stepIndex >= 3 ? 1 : 0.15,
            y: stepIndex >= 3 ? 0 : 6,
            duration: dur(0.45)
          },
          0
        );
        lightBridge.classList.toggle('bridge-active', stepIndex === 3);
      }
    } else {
      // Stage 2: Full Uncropped Poster Reveal (Step 4) & Final Hold State (Step 5)
      tributeView?.classList.add('hidden');
      finaleView?.classList.add('active');

      // Guarantee zero crop / zero zoom transform on the final poster
      if (finalePosterImg) gsap.set(finalePosterImg, { clearProps: 'transform' });
      if (finalePosterFrame) gsap.set(finalePosterFrame, { clearProps: 'transform' });

      if (stepIndex === 4) {
        tl.fromTo(
          finaleView,
          { autoAlpha: 0.25 },
          { autoAlpha: 1, duration: dur(0.55), clearProps: 'transform' },
          0
        );
      } else {
        gsap.set(finaleView, { autoAlpha: 1, clearProps: 'transform' });
      }

      if (finaleHoldBadge) {
        tl.to(
          finaleHoldBadge,
          {
            autoAlpha: stepIndex === 5 ? 1 : 0.55,
            scale: stepIndex === 5 ? 1.015 : 1,
            duration: dur(0.45)
          },
          0
        );
        finaleHoldBadge.classList.toggle('final-hold-active', stepIndex === 5);
      }
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
