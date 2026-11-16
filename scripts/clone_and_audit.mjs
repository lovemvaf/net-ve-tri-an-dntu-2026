import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';

const execAsync = promisify(exec);

const REPOS = [
  // A. Framework & Presentation
  { group: 'A. Framework & Presentation', name: 'react', url: 'https://github.com/react/react' },
  { group: 'A. Framework & Presentation', name: 'vuejs-core', url: 'https://github.com/vuejs/core' },
  { group: 'A. Framework & Presentation', name: 'reveal.js', url: 'https://github.com/hakimel/reveal.js' },
  { group: 'A. Framework & Presentation', name: 'slidev', url: 'https://github.com/slidevjs/slidev' },
  { group: 'A. Framework & Presentation', name: 'impress.js', url: 'https://github.com/impress/impress.js' },
  { group: 'A. Framework & Presentation', name: 'swiper', url: 'https://github.com/nolimits4web/swiper' },
  { group: 'A. Framework & Presentation', name: 'fullPage.js', url: 'https://github.com/alvarotrigo/fullPage.js' },

  // B. Animation & Cinematic Effects
  { group: 'B. Animation & Cinematic Effects', name: 'GSAP', url: 'https://github.com/greensock/GSAP' },
  { group: 'B. Animation & Cinematic Effects', name: 'gsap-skills', url: 'https://github.com/greensock/gsap-skills' },
  { group: 'B. Animation & Cinematic Effects', name: 'anime', url: 'https://github.com/juliangarnier/anime' },
  { group: 'B. Animation & Cinematic Effects', name: 'motion', url: 'https://github.com/motiondivision/motion' },
  { group: 'B. Animation & Cinematic Effects', name: 'react-bits', url: 'https://github.com/DavidHDev/react-bits' },
  { group: 'B. Animation & Cinematic Effects', name: 'magicui', url: 'https://github.com/magicuidesign/magicui' },
  { group: 'B. Animation & Cinematic Effects', name: 'lenis', url: 'https://github.com/darkroomengineering/lenis' },
  { group: 'B. Animation & Cinematic Effects', name: 'barba', url: 'https://github.com/barbajs/barba' },
  { group: 'B. Animation & Cinematic Effects', name: 'lottie-web', url: 'https://github.com/airbnb/lottie-web' },

  // C. 3D, WebGL, Particles & Postprocessing
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'three.js', url: 'https://github.com/mrdoob/three.js' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'react-three-fiber', url: 'https://github.com/pmndrs/react-three-fiber' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'drei', url: 'https://github.com/pmndrs/drei' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'postprocessing', url: 'https://github.com/pmndrs/postprocessing' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'pixijs', url: 'https://github.com/pixijs/pixijs' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'tsparticles', url: 'https://github.com/tsparticles/tsparticles' },
  { group: 'C. 3D, WebGL, Particles & Postprocessing', name: 'theatre', url: 'https://github.com/theatre-js/theatre' },

  // D. Advanced Slideshow & Text Effects
  { group: 'D. Advanced Slideshow & Text Effects', name: 'SlideshowAnimations', url: 'https://github.com/codrops/SlideshowAnimations' },
  { group: 'D. Advanced Slideshow & Text Effects', name: 'TextCharacterAnimations', url: 'https://github.com/codrops/TextCharacterAnimations' },
  { group: 'D. Advanced Slideshow & Text Effects', name: 'remotion', url: 'https://github.com/remotion-dev/remotion' },
  { group: 'D. Advanced Slideshow & Text Effects', name: 'motion-canvas', url: 'https://github.com/motion-canvas/motion-canvas' },

  // E. UI, Build & Testing
  { group: 'E. UI, Build & Testing', name: 'vite', url: 'https://github.com/vitejs/vite' },
  { group: 'E. UI, Build & Testing', name: 'tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
  { group: 'E. UI, Build & Testing', name: 'ui', url: 'https://github.com/shadcn-ui/ui' },
  { group: 'E. UI, Build & Testing', name: 'playwright', url: 'https://github.com/microsoft/playwright' },

  // F. Extra Codrops WebGL Showcase
  { group: 'F. Bonus Codrops & WebGL Transitions', name: 'WebGLDistortionSlider', url: 'https://github.com/codrops/WebGLDistortionSlider' }
];

const TARGET_DIR = path.resolve('.research/repos');

async function cloneRepo(repo) {
  const dest = path.join(TARGET_DIR, repo.name);
  let alreadyExists = false;
  try {
    const stat = await fs.stat(dest);
    if (stat.isDirectory()) {
      alreadyExists = true;
    }
  } catch (e) {
    alreadyExists = false;
  }

  if (alreadyExists) {
    console.log(`[SKIP] Already exists: ${repo.name}`);
    return { ...repo, status: 'EXISTS', dest };
  }

  console.log(`[CLONING] ${repo.name} from ${repo.url}...`);
  try {
    await execAsync(`git clone --depth 1 "${repo.url}" "${dest}"`, { timeout: 120000 });
    console.log(`[SUCCESS] Cloned: ${repo.name}`);
    return { ...repo, status: 'CLONED', dest };
  } catch (err) {
    console.error(`[ERROR] Failed to clone ${repo.name}: ${err.message}`);
    return { ...repo, status: 'FAILED', error: err.message, dest };
  }
}

async function runPool(items, limit, fn) {
  const results = [];
  const executing = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function main() {
  await fs.mkdir(TARGET_DIR, { recursive: true });
  console.log(`Starting shallow clone for ${REPOS.length} repositories into ${TARGET_DIR}...`);
  const cloneResults = await runPool(REPOS, 4, cloneRepo);

  console.log('\n--- Inspecting metadata for cloned repositories ---');
  const auditResults = [];

  for (const res of cloneResults) {
    const entry = {
      group: res.group,
      name: res.name,
      url: res.url,
      status: res.status,
      error: res.error || null,
      version: 'Unknown',
      license: 'Unknown',
      description: '',
      hasPackageJson: false
    };

    if (res.status === 'CLONED' || res.status === 'EXISTS') {
      const pkgPath = path.join(res.dest, 'package.json');
      try {
        const pkgRaw = await fs.readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgRaw);
        entry.hasPackageJson = true;
        entry.version = pkg.version || 'v-latest';
        entry.license = typeof pkg.license === 'string' ? pkg.license : (pkg.license?.type || 'See LICENSE');
        entry.description = pkg.description || '';
      } catch (err) {
        // Look for LICENSE file
        try {
          const files = await fs.readdir(res.dest);
          const licenseFile = files.find(f => f.toLowerCase().startsWith('license'));
          if (licenseFile) {
            const licText = await fs.readFile(path.join(res.dest, licenseFile), 'utf8');
            if (licText.includes('MIT')) entry.license = 'MIT';
            else if (licText.includes('Apache')) entry.license = 'Apache-2.0';
            else if (licText.includes('BSD')) entry.license = 'BSD';
            else if (licText.includes('GPL')) entry.license = 'GPL';
            else entry.license = 'Custom / File present';
          }
        } catch (_) {}
      }
    }

    auditResults.push(entry);
  }

  await fs.writeFile(
    path.join('.research', 'repos_audit_raw.json'),
    JSON.stringify(auditResults, null, 2),
    'utf8'
  );
  console.log('\nAudit raw data saved to .research/repos_audit_raw.json');
}

main().catch(err => {
  console.error('Fatal error in script:', err);
  process.exit(1);
});

