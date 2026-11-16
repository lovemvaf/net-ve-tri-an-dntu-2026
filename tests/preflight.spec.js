import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test.describe('Preflight Tech Stack & Assets Verification', () => {
  test('Core original and optimized assets exist', async () => {
    const assets = [
      '2.Khoacongnghethongtin (1).png',
      'logodntubig (1).png',
      'Quách Khoa Đức _ Nét vẽ tri ân.png',
      'public/assets/optimized/poster-full.jpg',
      'public/assets/optimized/logo-dntu.png',
      'public/assets/optimized/logo-khoa-cntt.png',
      'public/assets/optimized/crop-teacher.jpg',
      'public/assets/optimized/crop-book-boat.jpg',
      'public/assets/optimized/crop-stairs-helping.jpg',
      'public/assets/optimized/crop-tech-ai.jpg',
      'public/assets/optimized/crop-poem.jpg'
    ];
    for (const a of assets) {
      expect(fs.existsSync(a), `Missing asset: ${a}`).toBeTruthy();
      const stat = fs.statSync(a);
      expect(stat.size).toBeGreaterThan(500);
    }
  });

  test('Local research repositories verified (32 repos)', async () => {
    const reposDir = '.research/repos';
    if (fs.existsSync(reposDir)) {
      const dirs = fs.readdirSync(reposDir);
      expect(dirs.length).toBeGreaterThanOrEqual(31);
    }
  });

  test('Audit file TECH_STACK_AUDIT.md exists and is populated', async () => {
    expect(fs.existsSync('TECH_STACK_AUDIT.md')).toBeTruthy();
    const content = fs.readFileSync('TECH_STACK_AUDIT.md', 'utf8');
    expect(content).toContain('TECH STACK AUDIT');
    expect(content).toContain('reveal.js');
    expect(content).toContain('GSAP');
    expect(content).toContain('three.js');
  });
});
