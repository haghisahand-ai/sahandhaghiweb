/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Multilingual SEO Engine Unit Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSeoTitle,
  generateSeoDescription,
  buildSeoMetadata,
  truncateClean,
} from './seoHelper';

test('truncateClean handles short and long strings with word boundaries', () => {
  const short = 'Short title';
  assert.equal(truncateClean(short, 50), 'Short title');

  const long = 'This is an engineering thesis regarding high-frequency real-time order flow execution in financial markets with sub-millisecond latencies across London and New York sessions.';
  const truncated = truncateClean(long, 60);
  assert.ok(truncated.length <= 64);
  assert.ok(truncated.endsWith('...'));
  assert.equal(truncated.includes('  '), false, 'Should strip double spaces');
});

test('generateSeoTitle creates properly localized titles for all 4 CPTs', () => {
  // sahand_project
  const faProject = generateSeoTitle({
    id: 1,
    type: 'sahand_project',
    lang: 'fa',
    title: 'موتور معاملاتی MicroMap',
    slug: 'micromap-engine',
  });
  assert.equal(faProject, 'موتور معاملاتی MicroMap | پروژه مهندسی سهند');

  const enProject = generateSeoTitle({
    id: 1,
    type: 'sahand_project',
    lang: 'en',
    title: 'MicroMap Trading Engine',
    slug: 'micromap-engine',
  });
  assert.equal(enProject, 'MicroMap Trading Engine — Engineering Project | SAHAND');

  // sahand_product
  const enProduct = generateSeoTitle({
    id: 2,
    type: 'sahand_product',
    lang: 'en',
    title: 'Sahand Flow CLI',
    slug: 'sahand-flow-cli',
    meta: { productVersion: '2.1.0' },
  });
  assert.equal(enProduct, 'Sahand Flow CLI v2.1.0 — Launchpad Product | SAHAND');

  // sahand_ai_tool
  const trAiTool = generateSeoTitle({
    id: 3,
    type: 'sahand_ai_tool',
    lang: 'tr',
    title: 'Gemini Deney Ortamı',
    slug: 'gemini-sandbox',
  });
  assert.equal(trAiTool, 'Gemini Deney Ortamı — Yapay Zekâ Modeli | SAHAND');

  // sahand_insight
  const faInsight = generateSeoTitle({
    id: 4,
    type: 'sahand_insight',
    lang: 'fa',
    title: 'معماری دفاع در عمق وردپرس',
    slug: 'defense-in-depth-wp',
  });
  assert.equal(faInsight, 'معماری دفاع در عمق وردپرس | دیدگاه‌ها و تحلیل‌های فنی سهند');
});

test('generateSeoDescription combines problem and solution for engineering projects', () => {
  const desc = generateSeoDescription({
    id: 10,
    type: 'sahand_project',
    lang: 'en',
    title: 'Decoupled WordPress Architecture',
    slug: 'decoupled-wp',
    meta: {
      projectProblem: 'High server load caused by unoptimized Node processes on shared hosting environments',
      projectSolution: 'Clean presentation layer in sahand-theme with business logic isolated in sahand-core PHP plugin',
    },
  });

  assert.ok(desc.includes('High server load'));
  assert.ok(desc.includes('Clean presentation layer'));
  assert.ok(desc.length <= 160);
});

test('buildSeoMetadata outputs complete Open Graph, Twitter, and Schema.org metadata', () => {
  const meta = buildSeoMetadata({
    id: 101,
    type: 'sahand_project',
    lang: 'fa',
    title: 'هسته معاملاتی MicroMap',
    slug: 'micromap-core',
    authorName: 'سهند حقی',
    meta: {
      projectProblem: 'نیاز به پردازش جریان سفارشات با تاخیر کمتر از ۱ میلی‌ثانیه',
      projectSolution: 'توسعه موتور کم‌تاخیر با پایتون و وب‌سوکت بلادرنگ',
      projectGithub: 'https://github.com/sahand/micromap',
    },
  });

  assert.equal(meta.locale, 'fa_IR');
  assert.deepEqual(meta.alternateLocales, ['en_US', 'tr_TR']);
  assert.equal(meta.canonicalUrl, 'https://sahandhaghi.site/fa/projects/micromap-core/');
  assert.equal(meta.twitterCard, 'summary_large_image');
  assert.equal(meta.schemaJsonLd['@type'], 'SoftwareSourceCode');
  assert.equal(meta.schemaJsonLd['codeRepository'], 'https://github.com/sahand/micromap');
  assert.equal(meta.hreflangs.length, 3);
});

test('buildSeoMetadata respects custom SEO overrides and noindex', () => {
  const meta = buildSeoMetadata({
    id: 202,
    type: 'sahand_insight',
    lang: 'en',
    title: 'Draft Private Architecture Note',
    slug: 'draft-note',
    meta: {
      seoTitle: 'Custom Private SEO Title Override',
      seoDescription: 'Handcrafted meta description for optimal search indexing.',
      seoNoindex: true,
    },
  });

  assert.equal(meta.title, 'Custom Private SEO Title Override');
  assert.equal(meta.description, 'Handcrafted meta description for optimal search indexing.');
  assert.equal(meta.robots, 'noindex, nofollow');
});
