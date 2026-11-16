import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const REPOS = [
  // A. Framework & Presentation
  { id: 'react', name: 'react', group: 'A. Framework & Presentation', url: 'https://github.com/react/react', role: 'Research / Architecture Reference' },
  { id: 'vuejs-core', name: 'vuejs-core', group: 'A. Framework & Presentation', url: 'https://github.com/vuejs/core', role: 'Research / Architecture Reference' },
  { id: 'reveal.js', name: 'reveal.js', group: 'A. Framework & Presentation', url: 'https://github.com/hakimel/reveal.js', role: 'Direct Production Framework' },
  { id: 'slidev', name: 'slidev', group: 'A. Framework & Presentation', url: 'https://github.com/slidevjs/slidev', role: 'Research / Alternative Framework' },
  { id: 'impress.js', name: 'impress.js', group: 'A. Framework & Presentation', url: 'https://github.com/impress/impress.js', role: 'Research / 3D Space Presentation Reference' },
  { id: 'swiper', name: 'swiper', group: 'A. Framework & Presentation', url: 'https://github.com/nolimits4web/swiper', role: 'Research / Touch Carousel Reference' },
  { id: 'fullPage.js', name: 'fullPage.js', group: 'A. Framework & Presentation', url: 'https://github.com/alvarotrigo/fullPage.js', role: 'Research / Fullscreen Scroll Reference' },

  // B. Animation & Cinematic Effects
  { id: 'GSAP', name: 'GSAP', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/greensock/GSAP', role: 'Direct Production Motion Engine' },
  { id: 'gsap-skills', name: 'gsap-skills', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/greensock/gsap-skills', role: 'Best-Practice Skills & Prompting Reference' },
  { id: 'anime', name: 'anime', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/juliangarnier/anime', role: 'Research / Micro-interaction Reference' },
  { id: 'motion', name: 'motion', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/motiondivision/motion', role: 'Research / Modern WAAPI Motion Reference' },
  { id: 'react-bits', name: 'react-bits', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/DavidHDev/react-bits', role: 'Research / Creative Component Library' },
  { id: 'magicui', name: 'magicui', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/magicuidesign/magicui', role: 'Research / Premium UI Shaders & Gradients' },
  { id: 'lenis', name: 'lenis', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/darkroomengineering/lenis', role: 'Research / Smooth Scroll Engine' },
  { id: 'barba', name: 'barba', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/barbajs/barba', role: 'Research / Page Transition Orchestration' },
  { id: 'lottie-web', name: 'lottie-web', group: 'B. Animation & Cinematic Effects', url: 'https://github.com/airbnb/lottie-web', role: 'Research / Vector Animation Player' },

  // C. 3D, WebGL, Particles & Postprocessing
  { id: 'three.js', name: 'three.js', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/mrdoob/three.js', role: 'Direct Production 3D/WebGL Engine' },
  { id: 'react-three-fiber', name: 'react-three-fiber', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/pmndrs/react-three-fiber', role: 'Research / Declarative 3D Canvas Reference' },
  { id: 'drei', name: 'drei', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/pmndrs/drei', role: 'Research / Three.js Shader Shaders & Helpers' },
  { id: 'postprocessing', name: 'postprocessing', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/pmndrs/postprocessing', role: 'Research / GLSL Bloom & Post-processing' },
  { id: 'pixijs', name: 'pixijs', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/pixijs/pixijs', role: 'Research / 2D WebGL Sprite Alternative' },
  { id: 'tsparticles', name: 'tsparticles', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/tsparticles/tsparticles', role: 'Research / Advanced Particle Behavior Engine' },
  { id: 'theatre', name: 'theatre', group: 'C. 3D, WebGL, Particles & Postprocessing', url: 'https://github.com/theatre-js/theatre', role: 'Research / Motion Graphics & Timeline Tooling' },

  // D. Advanced Slideshow & Text Effects
  { id: 'SlideshowAnimations', name: 'SlideshowAnimations', group: 'D. Advanced Slideshow & Text Effects', url: 'https://github.com/codrops/SlideshowAnimations', role: 'Codrops Reference / Presentation Morphing' },
  { id: 'TextCharacterAnimations', name: 'TextCharacterAnimations', group: 'D. Advanced Slideshow & Text Effects', url: 'https://github.com/codrops/TextCharacterAnimations', role: 'Codrops Reference / Kinetic Typography' },
  { id: 'remotion', name: 'remotion', group: 'D. Advanced Slideshow & Text Effects', url: 'https://github.com/remotion-dev/remotion', role: 'Research / Code-based Video Engine' },
  { id: 'motion-canvas', name: 'motion-canvas', group: 'D. Advanced Slideshow & Text Effects', url: 'https://github.com/motion-canvas/motion-canvas', role: 'Research / Programmatic Animation Reference' },

  // E. UI, Build & Testing
  { id: 'vite', name: 'vite', group: 'E. UI, Build & Testing', url: 'https://github.com/vitejs/vite', role: 'Direct Production Bundler & Dev Server' },
  { id: 'tailwindcss', name: 'tailwindcss', group: 'E. UI, Build & Testing', url: 'https://github.com/tailwindlabs/tailwindcss', role: 'Direct / Dev CSS Engine' },
  { id: 'ui', name: 'ui', group: 'E. UI, Build & Testing', url: 'https://github.com/shadcn-ui/ui', role: 'Research / Headless UI Design Tokens' },
  { id: 'playwright', name: 'playwright', group: 'E. UI, Build & Testing', url: 'https://github.com/microsoft/playwright', role: 'Direct Production Testing & Screenshot Verification' },

  // F. Bonus Codrops & WebGL Transitions
  { id: 'hover-effect', name: 'hover-effect', group: 'F. Bonus Codrops & WebGL Transitions', url: 'https://github.com/robin-dela/hover-effect', role: 'Direct WebGL Transition Reference (Robin Delaporte / Codrops)' }
];

const TARGET_DIR = path.resolve('.research/repos');

async function auditAll() {
  const auditEntries = [];

  for (const repo of REPOS) {
    const dir = path.join(TARGET_DIR, repo.id);
    let commit = 'unknown';
    let version = 'v-latest';
    let license = 'Check repo';
    let description = '';
    let filesCount = 0;

    try {
      const files = await fs.readdir(dir);
      filesCount = files.length;
      try {
        commit = execSync(`git -C "${dir}" rev-parse --short HEAD`, { encoding: 'utf8' }).trim();
      } catch (_) {}

      const pkgPath = path.join(dir, 'package.json');
      try {
        const pkgData = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
        version = pkgData.version || 'v-latest';
        license = typeof pkgData.license === 'string' ? pkgData.license : (pkgData.license?.type || 'Custom');
        description = pkgData.description || '';
      } catch (err) {
        // Fallback license check
        const licFile = files.find(f => f.toLowerCase().startsWith('license'));
        if (licFile) {
          const licText = await fs.readFile(path.join(dir, licFile), 'utf8');
          if (licText.includes('MIT')) license = 'MIT';
          else if (licText.includes('Apache')) license = 'Apache-2.0';
          else if (licText.includes('BSD')) license = 'BSD';
          else if (licText.includes('GPL')) license = 'GPL';
          else license = 'Custom LICENSE file';
        }
      }
    } catch (e) {
      console.error(`Error reading ${repo.id}:`, e.message);
    }

    auditEntries.push({
      ...repo,
      filesCount,
      commit,
      version,
      license,
      description: description.replace(/[\r\n]+/g, ' ').slice(0, 140)
    });
  }

  await fs.writeFile(
    path.join('.research', 'audit_full.json'),
    JSON.stringify(auditEntries, null, 2),
    'utf8'
  );
  console.log('Successfully generated full audit data for', auditEntries.length, 'repos.');
}

auditAll();

