import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateExpertAnalysis } from './aiExpertEngine';

test('generateExpertAnalysis returns financial order flow evaluation for Persian financial prompts', () => {
  const result = generateExpertAnalysis({
    prompt: 'بررسی جریان سفارشات و موتور micromap در سشن لندن',
    language: 'fa',
    model: 'gemini-3.8-flash',
  });

  assert.ok(result.includes('ارزیابی معماری و استنتاج فنی موتور MicroMap'));
  assert.ok(result.includes('تحلیل جریان سفارشات'));
  assert.ok(result.includes('سشن لندن'));
});

test('generateExpertAnalysis returns security evaluation for Persian security prompts', () => {
  const result = generateExpertAnalysis({
    prompt: 'مدل سازی تهدیدات stride و محدودسازی نرخ rate limiting',
    language: 'fa',
    model: 'gemini-3.8-flash',
  });

  assert.ok(result.includes('ارزیابی امنیتی هسته و دفاع در عمق'));
  assert.ok(result.includes('STRIDE Threat Model'));
  assert.ok(result.includes('Atomic Rate Limiting'));
});

test('generateExpertAnalysis returns English analysis for en language code', () => {
  const result = generateExpertAnalysis({
    prompt: 'Evaluate order flow dynamics and decoupled architecture',
    language: 'en',
    model: 'gemini-3.8-flash',
  });

  assert.ok(result.includes('SAHAND Engineering Architecture'));
  assert.ok(result.includes('Order Flow Dynamics'));
  assert.ok(result.includes('Decoupled Architecture'));
});

test('generateExpertAnalysis returns Turkish analysis for tr language code', () => {
  const result = generateExpertAnalysis({
    prompt: 'Sistem mimarisi ve mikro yapı analizi',
    language: 'tr',
    model: 'gemini-3.8-flash',
  });

  assert.ok(result.includes('SAHAND Yapay Zeka Laboratuvarı'));
  assert.ok(result.includes('Emir Akışı'));
});
