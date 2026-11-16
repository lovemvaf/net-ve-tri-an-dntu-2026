import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REMAINING = [
  { name: 'motion', url: 'https://github.com/motiondivision/motion' },
  { name: 'react-bits', url: 'https://github.com/DavidHDev/react-bits' },
  { name: 'three.js', url: 'https://github.com/mrdoob/three.js' },
  { name: 'tsparticles', url: 'https://github.com/tsparticles/tsparticles' },
  { name: 'remotion', url: 'https://github.com/remotion-dev/remotion' },
  { name: 'hover-effect', url: 'https://github.com/robin-dela/hover-effect' }
];

const TARGET_DIR = path.resolve('.research/repos');

for (const repo of REMAINING) {
  const dest = path.join(TARGET_DIR, repo.name);
  if (fs.existsSync(dest)) {
    console.log(`Removing incomplete directory: ${dest}`);
    fs.rmSync(dest, { recursive: true, force: true });
  }

  console.log(`\nCloning ${repo.name} from ${repo.url}...`);
  try {
    execSync(`git clone --depth 1 "${repo.url}" "${dest}"`, {
      stdio: 'inherit',
      timeout: 300000 // 5 minutes each
    });
    console.log(`[SUCCESS] Cloned: ${repo.name}`);
  } catch (err) {
    console.error(`[ERROR] Failed to clone ${repo.name}:`, err.message);
  }
}

console.log('\n--- Finished cloning remaining repos ---');

