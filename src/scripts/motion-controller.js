import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Flip } from 'gsap/Flip';
import confetti from 'canvas-confetti';

gsap.registerPlugin(SplitText, CustomEase, MorphSVGPlugin, Flip);
CustomEase.create('cinematicOut', '0.16, 1, 0.3, 1');
CustomEase.create('softInOut', '0.65, 0, 0.35, 1');

export function createMotionController() {
  let activeTimeline = null;
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
    const paths = container.querySelectorAll('.svg-draw-path');
    paths.forEach(p => {
      try {
        const len = p.getTotalLength ? p.getTotalLength() : 600;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      } catch (_) {}
    });
    return paths;
  }

  function animateSlide(slideElement, slideIndex) {
    if (!slideElement) return;
    cleanup();

    const fadeItems = slideElement.querySelectorAll('.anim-item');
    const strokePaths = prepareStrokePaths(slideElement);

    if (isReducedMotion) {
      gsap.set(fadeItems, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'filter,transform' });
      strokePaths.forEach(p => gsap.set(p, { strokeDashoffset: 0, opacity: 1 }));
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'cinematicOut' } });
    activeTimeline = tl;

    gsap.set(fadeItems, { opacity: 0, y: 24 });

    // SplitText for main slide title if present
    const titleEl = slideElement.querySelector('.split-title');
    let titleWords = null;
    if (titleEl) {
      try {
        const split = new SplitText(titleEl, { type: 'words', wordsClass: 'split-word' });
        activeSplits.push(split);
        titleWords = split.words;
        gsap.set(titleWords, { opacity: 0, y: 28, rotateX: -25 });
      } catch (_) {
        titleWords = null;
      }
    }

    // 1. Draw SVG Golden Light Paths first (the "Nét vẽ ánh sáng" motif)
    if (strokePaths.length > 0) {
      tl.to(strokePaths, {
        strokeDashoffset: 0,
        duration: 1.35,
        stagger: 0.18,
        ease: 'softInOut'
      }, 0.05);
    }

    // 2. Reveal SplitText words
    if (titleWords && titleWords.length > 0) {
      tl.to(titleWords, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.045,
        ease: 'cinematicOut'
      }, 0.12);
    }

    // 3. Staggered reveal of narrative items
    if (fadeItems.length > 0) {
      tl.to(fadeItems, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'cinematicOut'
      }, 0.22);
    }

    // 4. Slide-specific subtle cinematic camera / focal motions
    if (slideIndex === 0) {
      const posterCard = slideElement.querySelector('.hero-poster-stage');
      if (posterCard) {
        tl.fromTo(
          posterCard,
          { opacity: 0, scale: 0.94, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 1.25, ease: 'cinematicOut' },
          0.15
        );
      }
    } else if (slideIndex === 1) {
      const teacherStage = slideElement.querySelector('.teacher-art-stage');
      if (teacherStage) {
        tl.fromTo(
          teacherStage,
          { opacity: 0, scale: 0.95, x: -20 },
          { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: 'cinematicOut' },
          0.18
        );
      }
    } else if (slideIndex === 2) {
      const showcase = slideElement.querySelector('.slide3-visual-stage');
      if (showcase) {
        tl.fromTo(
          showcase,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.15, ease: 'cinematicOut' },
          0.15
        );
      }
    } else if (slideIndex === 3) {
      const criteriaCards = slideElement.querySelectorAll('.criteria-pillar-card');
      if (criteriaCards.length > 0) {
        tl.fromTo(
          criteriaCards,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'cinematicOut' },
          0.3
        );
      }
    }
  }

  // Interactive camera pan/zoom & layer switch on Slide 3
  function focusSlide3Zone(zoneIndex) {
    const stage = document.getElementById('slide3-camera-target');
    const detailImg = document.getElementById('slide3-detail-crop');
    const detailCaption = document.getElementById('slide3-detail-caption');
    const detailSub = document.getElementById('slide3-detail-sub');
    const tabs = document.querySelectorAll('.zone-tab-btn');

    const zones = [
      {
        scale: 1.35,
        originX: '52%',
        originY: '62%',
        cropSrc: './assets/optimized/crop-book-boat.jpg',
        title: '01 · Quyển Sách Hóa Con Thuyền & Hai Sinh Viên',
        sub: 'Hai sinh viên (một nam mang ba lô, một nữ quàng khăn đỏ) ngồi trên con thuyền sách mở rộng giữa tầng mây, cùng hướng về tương lai.'
      },
      {
        scale: 1.42,
        originX: '64%',
        originY: '36%',
        cropSrc: './assets/optimized/crop-stairs-helping.jpg',
        title: '02 · Cầu Thang Sách, Bàn Tay Nâng Đỡ & 5 Biển Chỉ Dẫn',
        sub: 'Những bậc thang tạo từ chồng sách vươn lên trời cao; người sinh viên đi trước đưa tay hỗ trợ bạn mình cùng tiến bước.'
      },
      {
        scale: 1.48,
        originX: '84%',
        originY: '52%',
        cropSrc: './assets/optimized/crop-tech-ai.jpg',
        title: '03 · Laptop, Vi Mạch AI, Cloud & Ánh Bình Minh',
        sub: 'Đoạn mã Python def future(): learn(), create(), contribute(), return better_world() cùng mạch AI hướng tới chân trời bình minh.'
      },
      {
        scale: 1.0,
        originX: '50%',
        originY: '50%',
        cropSrc: './assets/optimized/crop-book-boat.jpg',
        title: 'Toàn Cảnh Tác Phẩm — Từ Trang Sách Đến Chân Trời',
        sub: 'Sự kết nối liền mạch từ nét sáng người thầy, con thuyền sách của hai sinh viên, cầu thang tri thức tới bình minh tương lai.'
      }
    ];

    const z = zones[zoneIndex] || zones[0];
    tabs.forEach((btn, idx) => btn.classList.toggle('active', idx === zoneIndex));

    if (stage) {
      gsap.to(stage, {
        scale: isReducedMotion ? 1 : z.scale,
        transformOrigin: `${z.originX} ${z.originY}`,
        duration: isReducedMotion ? 0.01 : 1.1,
        ease: 'cinematicOut'
      });
    }

    if (detailImg && detailCaption && detailSub) {
      gsap.to([detailImg, detailCaption, detailSub], {
        opacity: 0,
        y: 6,
        duration: isReducedMotion ? 0.01 : 0.22,
        onComplete: () => {
          detailImg.src = z.cropSrc;
          detailCaption.textContent = z.title;
          detailSub.textContent = z.sub;
          gsap.to([detailImg, detailCaption, detailSub], {
            opacity: 1,
            y: 0,
            duration: isReducedMotion ? 0.01 : 0.45,
            ease: 'cinematicOut'
          });
        }
      });
    }
  }

  function triggerCelebrationConfetti() {
    if (isReducedMotion) return;
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.68 },
      colors: ['#F0CC85', '#F8F1E3', '#AD1F29', '#19365F', '#D4A853']
    });
  }

  function setReducedMotion(reduced) {
    isReducedMotion = reduced;
  }

  return {
    animateSlide,
    focusSlide3Zone,
    triggerCelebrationConfetti,
    setReducedMotion,
    cleanup
  };
}
