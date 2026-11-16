import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Flip } from 'gsap/Flip';
import { SLIDE5_SCENES } from '../content/presentation-data.js';

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

    return new Promise(resolve => {
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
        duration: 0.38,
        ease: 'softInOut',
        onComplete: () => {
          onMidpoint?.();
        }
      })
      .to(overlay, {
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.out'
      });
    });
  }

  // ===========================================================================
  // LANDING PAGE — 6 SEQUENTIAL STEPS (0..5)
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
        tl.to(penStroke, { strokeDashoffset: 0, duration: dur(0.85), ease: 'softInOut' }, 0);
      } else {
        gsap.set(penStroke, { strokeDasharray: len, strokeDashoffset: 0, autoAlpha: 1 });
      }
    }

    // Step 1+: 20/11 Greeting & Floating Petals
    tl.to([dateBadge, eyebrow2011, petalsGroup], {
      autoAlpha: stepIndex >= 1 ? 1 : 0,
      y: stepIndex >= 1 ? 0 : 14,
      duration: dur(0.55)
    }, 0);

    // Step 2+: 20/11 Floral Bouquet & Circuit Stems
    tl.to(bouquetGroup, {
      autoAlpha: stepIndex >= 2 ? 1 : 0.15,
      scale: stepIndex >= 2 ? 1 : 0.9,
      transformOrigin: 'center bottom',
      duration: dur(0.65)
    }, 0);

    // Step 3+: Full Original Poster Reveal (Always object-fit: contain, zero crop)
    if (posterContainer && posterImg) {
      gsap.set(posterImg, { clearProps: 'transform' });
      tl.to(aura, {
        autoAlpha: stepIndex >= 3 ? 1 : 0.25,
        scale: stepIndex >= 3 ? 1 : 0.85,
        duration: dur(0.65)
      }, 0);
      tl.to(posterContainer, {
        autoAlpha: stepIndex >= 3 ? 1 : 0.18,
        scale: 1,
        duration: dur(0.65),
        clearProps: 'transform'
      }, 0);
    }

    // Step 4+: Main Title, Slogan & Lead Quote
    tl.to(titleGroup, {
      autoAlpha: stepIndex >= 4 ? 1 : 0.12,
      y: stepIndex >= 4 ? 0 : 14,
      duration: dur(0.55),
      clearProps: stepIndex >= 4 ? 'transform' : ''
    }, 0);

    // Step 5: Right Wing Meta & CTA Button "KHÁM PHÁ HÀNH TRÌNH TRI ÂN"
    tl.to(ctaGroup, {
      autoAlpha: stepIndex >= 5 ? 1 : 0.15,
      y: stepIndex >= 5 ? 0 : 14,
      duration: dur(0.55),
      clearProps: stepIndex >= 5 ? 'transform' : ''
    }, 0);

    const btnEnter = document.getElementById('btn-enter-journey');
    if (btnEnter) {
      btnEnter.classList.toggle('pulse-ready', stepIndex === 5);
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

    tl.to([quoteCard, posterStage, codePill], {
      autoAlpha: 1,
      y: 0,
      duration: dur(0.5),
      clearProps: 'transform'
    }, 0);

    // Step 1+: 4 Chapters illuminate
    tl.to(arcCards, {
      autoAlpha: stepIndex >= 1 ? 1 : 0.22,
      y: stepIndex >= 1 ? 0 : 10,
      stagger: stepIndex === 1 ? dur(0.08) : 0,
      duration: dur(0.45),
      clearProps: stepIndex >= 1 ? 'transform' : ''
    }, 0);
    arcCards.forEach((c, idx) => c.classList.toggle('step-highlighted', stepIndex === 1));

    // Step 2: Poem Strip & Guiding Light
    tl.to(poemStrip, {
      autoAlpha: stepIndex >= 2 ? 1 : 0.25,
      scale: stepIndex === 2 ? 1.01 : 1,
      duration: dur(0.45),
      clearProps: stepIndex < 2 ? 'transform' : ''
    }, 0);
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
      tl.to(lightPath, { strokeDashoffset: 0, duration: dur(0.7) }, 0);
    }

    // Highlight corresponding memory card for steps 0, 1, 2, or all in step 3
    cards.forEach((card, idx) => {
      const isRevealed = stepIndex >= idx;
      const isFocused = stepIndex === idx || stepIndex === 3;
      tl.to(card, {
        autoAlpha: isRevealed ? (isFocused ? 1 : 0.58) : 0.18,
        x: isFocused && stepIndex === idx ? 6 : 0,
        duration: dur(0.45)
      }, 0);
      card.classList.toggle('step-active-card', stepIndex === idx || stepIndex === 3);
    });

    // Camera/crop emphasis
    if (cropCards.length === 2) {
      tl.to(cropCards[0], {
        scale: stepIndex === 3 ? 1.02 : 1,
        duration: dur(0.45)
      }, 0);
      tl.to(cropCards[1], {
        scale: stepIndex === 0 ? 1.02 : 1,
        duration: dur(0.45)
      }, 0);
    }

    if (floralAccent) {
      tl.to(floralAccent, {
        autoAlpha: stepIndex >= 3 ? 1 : 0.3,
        scale: stepIndex === 3 ? 1.03 : 1,
        duration: dur(0.45)
      }, 0);
    }
  }

  // ===========================================================================
  // SLIDE 03 — 4 SEQUENTIAL STEPS (0..3: Con thuyền -> Cầu thang -> AI -> Toàn cảnh)
  // ===========================================================================
  function applySlide3Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const stage = document.getElementById('slide3-camera-target');
    const detailImg = document.getElementById('slide3-detail-crop');
    const detailCaption = document.getElementById('slide3-detail-caption');
    const detailSub = document.getElementById('slide3-detail-sub');
    const tabs = slideEl.querySelectorAll('.zone-tab-btn');
    const symbolItems = slideEl.querySelectorAll('.symbol-item');

    const zones = [
      {
        scale: 1.32,
        originX: '52%',
        originY: '62%',
        cropSrc: './assets/optimized/crop-book-boat.jpg',
        title: 'Bước 01 / 04 · Quyển Sách Hóa Con Thuyền & Hai Sinh Viên',
        sub: 'Hai sinh viên (một nam mang ba lô, một nữ quàng khăn đỏ) ngồi trên con thuyền sách mở rộng giữa tầng mây, cùng hướng về tương lai.'
      },
      {
        scale: 1.38,
        originX: '64%',
        originY: '36%',
        cropSrc: './assets/optimized/crop-stairs-helping.jpg',
        title: 'Bước 02 / 04 · Cầu Thang Sách, Bàn Tay Nâng Đỡ & 5 Biển Chỉ Dẫn',
        sub: 'Những bậc thang tạo từ chồng sách vươn lên trời cao; người sinh viên đi trước đưa tay hỗ trợ bạn mình cùng tiến bước.'
      },
      {
        scale: 1.42,
        originX: '84%',
        originY: '52%',
        cropSrc: './assets/optimized/crop-tech-ai.jpg',
        title: 'Bước 03 / 04 · Laptop def future(), Vi Mạch AI, Cloud & Ánh Bình Minh',
        sub: 'Đoạn mã Python def future(): learn(), create(), contribute(), return better_world() cùng mạch AI hướng tới chân trời bình minh.'
      },
      {
        scale: 1.0,
        originX: '50%',
        originY: '50%',
        cropSrc: './assets/optimized/poster-full.jpg',
        title: 'Bước 04 / 04 · Toàn Cảnh Tác Phẩm — Từ Trang Sách Đến Chân Trời',
        sub: 'Camera lùi về toàn cảnh để kết nối trọn vẹn người thầy, con thuyền sách của hai sinh viên, cầu thang tri thức và bình minh tương lai.'
      }
    ];

    const z = zones[stepIndex] || zones[0];
    tabs.forEach((btn, idx) => btn.classList.toggle('active', idx === stepIndex));
    symbolItems.forEach((item, idx) => {
      const isFocused = stepIndex === 3 || idx === stepIndex;
      item.classList.toggle('step-active-card', idx === stepIndex);
      gsap.to(item, { autoAlpha: isFocused ? 1 : 0.45, duration: dur(0.35) });
    });

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stage) {
      tl.to(stage, {
        scale: isReducedMotion ? 1 : z.scale,
        transformOrigin: `${z.originX} ${z.originY}`,
        duration: dur(0.75)
      }, 0);
    }

    if (detailImg && detailCaption && detailSub) {
      detailImg.src = z.cropSrc;
      detailCaption.textContent = z.title;
      detailSub.textContent = z.sub;
      tl.fromTo(
        [detailImg, detailCaption, detailSub],
        { autoAlpha: 0.35 },
        { autoAlpha: 1, duration: dur(0.45) },
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

    // Step 0+: Inspiration box
    tl.to(journeyBox, {
      autoAlpha: 1,
      scale: stepIndex === 0 ? 1.015 : 1,
      duration: dur(0.4)
    }, 0);

    // Connector line progress across steps 1..5
    if (connectorPath) {
      const len = 1380;
      const progress = Math.max(0, Math.min(1, (stepIndex - 1) / 4));
      gsap.set(connectorPath, { strokeDasharray: len });
      tl.to(connectorPath, {
        strokeDashoffset: stepIndex === 0 ? len : len * (1 - progress),
        duration: dur(0.5)
      }, 0);
    }

    // Steps 1..5: 5 Criteria Pillars
    cards.forEach((card, idx) => {
      const criterionStep = idx + 1;
      const isReached = stepIndex >= criterionStep;
      const isCurrent = stepIndex === criterionStep || stepIndex === 6;

      card.classList.toggle('criteria-active', isCurrent);
      tl.to(card, {
        autoAlpha: isReached ? (isCurrent ? 1 : 0.72) : 0.22,
        y: stepIndex === criterionStep ? -8 : 0,
        scale: stepIndex === criterionStep ? 1.03 : 1,
        duration: dur(0.45)
      }, 0);
    });

    // Step 6: Culmination Banner "02 NĂM LIÊN TIẾP — SINH VIÊN 5 TỐT"
    tl.to(culminationBar, {
      autoAlpha: stepIndex >= 6 ? 1 : 0.22,
      y: stepIndex >= 6 ? 0 : 10,
      scale: stepIndex === 6 ? 1.01 : 0.99,
      duration: dur(0.5)
    }, 0);
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

    const updateDOM = () => {
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

      heroCard?.classList.toggle('achievement-gold-frame', !!scene.isAchievementHighlight);
    };

    updateDOM();

    if (!isReducedMotion && lastSlide5Scene !== stepIndex && stage) {
      const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
      activeTimeline = tl;
      tl.fromTo(
        heroCard,
        { autoAlpha: 0.35, y: 12 },
        { autoAlpha: 1, y: 0, duration: dur(0.55), clearProps: 'transform' },
        0
      ).fromTo(
        sideCards,
        { autoAlpha: 0.35, x: 14 },
        { autoAlpha: 1, x: 0, stagger: dur(0.08), duration: dur(0.55), clearProps: 'transform' },
        0.06
      );
    }
    lastSlide5Scene = stepIndex;
  }

  // ===========================================================================
  // SLIDE 06 — 5 SEQUENTIAL STEPS (0: Chân dung, 1: Tri ân, 2: Hoa 20/11, 3: Poster Reveal, 4: Final Hold)
  // ===========================================================================
  function applySlide6Step(slideEl, stepIndex) {
    killActiveTimeline();
    if (!slideEl) return;
    slideEl.setAttribute('data-active-step', String(stepIndex));

    const tributeView = document.getElementById('slide6-tribute-view');
    const finaleView = document.getElementById('slide6-finale-view');
    const pillars = slideEl.querySelectorAll('.gratitude-pillar-item');
    const closingQuote = slideEl.querySelector('.final-closing-quote');
    const floralTribute = document.getElementById('slide6-floral-tribute');
    const finalePosterFrame = document.getElementById('finale-poster-container');
    const finalePosterImg = document.getElementById('finale-full-poster-img');
    const finaleHoldBadge = document.getElementById('finale-hold-badge');

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    if (stepIndex <= 2) {
      // Steps 0, 1, 2: Show Part A (Portrait + Gratitude + 20/11 Floral Tribute)
      finaleView?.classList.remove('active');
      tributeView?.classList.remove('hidden');

      tl.to(pillars, {
        autoAlpha: stepIndex >= 1 ? 1 : 0.25,
        y: stepIndex >= 1 ? 0 : 8,
        stagger: stepIndex === 1 ? dur(0.08) : 0,
        duration: dur(0.45)
      }, 0);

      tl.to(closingQuote, {
        autoAlpha: stepIndex >= 1 ? 1 : 0.3,
        duration: dur(0.45)
      }, 0);

      if (floralTribute) {
        tl.to(floralTribute, {
          autoAlpha: stepIndex >= 2 ? 1 : 0.15,
          scale: stepIndex === 2 ? 1.02 : 0.95,
          duration: dur(0.55)
        }, 0);
        floralTribute.classList.toggle('floral-bloom-active', stepIndex === 2);
      }
    } else {
      // Steps 3 & 4: Show Part B (Full Poster Reveal & Final Hold State)
      tributeView?.classList.add('hidden');
      finaleView?.classList.add('active');

      // Guarantee zero crop / zero zoom transform on the final poster
      if (finalePosterImg) gsap.set(finalePosterImg, { clearProps: 'transform' });
      if (finalePosterFrame) gsap.set(finalePosterFrame, { clearProps: 'transform' });

      if (stepIndex === 3) {
        tl.fromTo(
          finaleView,
          { autoAlpha: 0.2 },
          { autoAlpha: 1, duration: dur(0.65), clearProps: 'transform' },
          0
        );
      } else {
        gsap.set(finaleView, { autoAlpha: 1, clearProps: 'transform' });
      }

      if (finaleHoldBadge) {
        tl.to(finaleHoldBadge, {
          autoAlpha: stepIndex === 4 ? 1 : 0.5,
          scale: stepIndex === 4 ? 1.02 : 1,
          duration: dur(0.45)
        }, 0);
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
