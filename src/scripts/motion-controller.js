import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(SplitText, CustomEase, MorphSVGPlugin, Flip);
CustomEase.create('cinematicOut', '0.16, 1, 0.3, 1');
CustomEase.create('softInOut', '0.65, 0, 0.35, 1');

export function createMotionController() {
  let activeTimeline = null;
  let landingTimeline = null;
  let activeSplits = [];
  let isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  function cleanup() {
    if (activeTimeline) {
      activeTimeline.kill();
      activeTimeline = null;
    }
    if (activeSplits.length > 0) {
      activeSplits.forEach(s => {
        try { s.revert(); } catch (_) {}
      });
      activeSplits = [];
    }
  }

  function prepareStrokePaths(container) {
    if (!container) return [];
    const paths = container.querySelectorAll('.svg-draw-path');
    paths.forEach(p => {
      try {
        const len = p.getTotalLength ? p.getTotalLength() : 600;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      } catch (_) {}
    });
    return paths;
  }

  // 1. Opening Choreography for the 20/11 Landing Page
  function animateLandingOpening() {
    const landing = document.getElementById('landing-page');
    if (!landing) return;
    if (landingTimeline) landingTimeline.kill();

    const items = landing.querySelectorAll('.landing-anim');
    const paths = prepareStrokePaths(landing);
    const posterFrame = landing.querySelector('.landing-poster-frame');
    const aura = landing.querySelector('.landing-poster-aura');

    if (isReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: 'transform' });
      paths.forEach(p => gsap.set(p, { strokeDashoffset: 0, opacity: 1 }));
      if (posterFrame) gsap.set(posterFrame, { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    landingTimeline = tl;

    gsap.set(items, { opacity: 0, y: 20 });
    if (posterFrame) gsap.set(posterFrame, { opacity: 0, scale: 0.96 });
    if (aura) gsap.set(aura, { opacity: 0, scale: 0.85 });

    if (paths.length > 0) {
      tl.to(paths, { strokeDashoffset: 0, duration: 1.2, ease: 'softInOut' }, 0.1);
    }
    if (aura) {
      tl.to(aura, { opacity: 1, scale: 1, duration: 1.4 }, 0.15);
    }
    if (posterFrame) {
      tl.to(posterFrame, {
        opacity: 1,
        scale: 1,
        duration: 1.25,
        clearProps: 'transform'
      }, 0.2);
    }
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.09,
      clearProps: 'transform'
    }, 0.25);
  }

  // 2. Per-Slide Choreography (Slides 01 to 06)
  function animateSlide(slideElement, slideIndex) {
    if (!slideElement) return;
    cleanup();

    const fadeItems = slideElement.querySelectorAll('.anim-item');
    const strokePaths = prepareStrokePaths(slideElement);

    if (isReducedMotion) {
      gsap.set(fadeItems, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' });
      strokePaths.forEach(p => gsap.set(p, { strokeDashoffset: 0, opacity: 1 }));
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    gsap.set(fadeItems, { opacity: 0, y: 20 });

    const titleEl = slideElement.querySelector('.split-title');
    let titleWords = null;
    if (titleEl) {
      try {
        const split = new SplitText(titleEl, { type: 'words', wordsClass: 'split-word' });
        activeSplits.push(split);
        titleWords = split.words;
        gsap.set(titleWords, { opacity: 0, y: 22 });
      } catch (_) {
        titleWords = null;
      }
    }

    if (strokePaths.length > 0) {
      tl.to(strokePaths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'softInOut'
      }, 0.05);
    }

    if (titleWords && titleWords.length > 0) {
      tl.to(titleWords, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.038,
        clearProps: 'transform'
      }, 0.1);
    }

    if (fadeItems.length > 0) {
      tl.to(fadeItems, {
        opacity: 1,
        y: 0,
        duration: 0.78,
        stagger: 0.08,
        clearProps: 'transform'
      }, 0.18);
    }

    if (slideIndex === 3) {
      const criteriaCards = slideElement.querySelectorAll('.criteria-pillar-card');
      if (criteriaCards.length > 0) {
        tl.fromTo(
          criteriaCards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, clearProps: 'transform' },
          0.25
        );
      }
    }
  }

  // 3. Interactive Camera Pan/Zoom on Slide 03
  function focusSlide3Zone(zoneIndex) {
    const stage = document.getElementById('slide3-camera-target');
    const detailImg = document.getElementById('slide3-detail-crop');
    const detailCaption = document.getElementById('slide3-detail-caption');
    const detailSub = document.getElementById('slide3-detail-sub');
    const tabs = document.querySelectorAll('.zone-tab-btn');

    const zones = [
      {
        scale: 1.32,
        originX: '52%',
        originY: '62%',
        cropSrc: './assets/optimized/crop-book-boat.jpg',
        title: '01 · Quyển Sách Hóa Con Thuyền & Hai Sinh Viên',
        sub: 'Hai sinh viên (một nam mang ba lô, một nữ quàng khăn đỏ) ngồi trên con thuyền sách mở rộng giữa tầng mây, cùng hướng về tương lai.'
      },
      {
        scale: 1.38,
        originX: '64%',
        originY: '36%',
        cropSrc: './assets/optimized/crop-stairs-helping.jpg',
        title: '02 · Cầu Thang Sách, Bàn Tay Nâng Đỡ & 5 Biển Chỉ Dẫn',
        sub: 'Những bậc thang tạo từ chồng sách vươn lên trời cao; người sinh viên đi trước đưa tay hỗ trợ bạn mình cùng tiến bước.'
      },
      {
        scale: 1.42,
        originX: '84%',
        originY: '52%',
        cropSrc: './assets/optimized/crop-tech-ai.jpg',
        title: '03 · Laptop def future(), Vi Mạch AI, Cloud & Ánh Bình Minh',
        sub: 'Đoạn mã Python def future(): learn(), create(), contribute(), return better_world() cùng mạch AI hướng tới chân trời bình minh.'
      },
      {
        scale: 1.0,
        originX: '50%',
        originY: '50%',
        cropSrc: './assets/optimized/poster-full.jpg',
        title: '04 · Toàn Cảnh Tác Phẩm — Từ Trang Sách Đến Chân Trời',
        sub: 'Sự kết nối liền mạch từ nét sáng người thầy, con thuyền sách của hai sinh viên, cầu thang tri thức tới bình minh tương lai.'
      }
    ];

    const z = zones[zoneIndex] || zones[0];
    tabs.forEach((btn, idx) => btn.classList.toggle('active', idx === zoneIndex));

    if (stage) {
      gsap.to(stage, {
        scale: isReducedMotion ? 1 : z.scale,
        transformOrigin: `${z.originX} ${z.originY}`,
        duration: isReducedMotion ? 0.01 : 0.95,
        ease: 'cinematicOut'
      });
    }

    if (detailImg && detailCaption && detailSub) {
      gsap.to([detailImg, detailCaption, detailSub], {
        opacity: 0,
        duration: isReducedMotion ? 0.01 : 0.18,
        onComplete: () => {
          detailImg.src = z.cropSrc;
          detailCaption.textContent = z.title;
          detailSub.textContent = z.sub;
          gsap.to([detailImg, detailCaption, detailSub], {
            opacity: 1,
            duration: isReducedMotion ? 0.01 : 0.38,
            ease: 'cinematicOut'
          });
        }
      });
    }
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
  }

  return {
    animateLandingOpening,
    animateSlide,
    focusSlide3Zone,
    setReducedMotion,
    cleanup
  };
}
