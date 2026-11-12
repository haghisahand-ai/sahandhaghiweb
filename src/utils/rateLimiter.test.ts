import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryRateLimiter, resolveClientIp } from './rateLimiter';

test('MemoryRateLimiter allows requests up to max threshold', () => {
  const limiter = new MemoryRateLimiter();
  const ip = '198.51.100.1';
  const action = 'contact_form';
  const max = 5;
  const windowMs = 60000;

  for (let i = 1; i <= max; i++) {
    const res = limiter.checkAndIncrement(ip, action, max, windowMs);
    assert.equal(res.allowed, true);
    assert.equal(res.current, i);
    assert.equal(res.retryAfter, 0);
  }

  // Next request exceeds limit
  const blocked = limiter.checkAndIncrement(ip, action, max, windowMs);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.current, max);
  assert.ok(blocked.retryAfter > 0);
});

test('MemoryRateLimiter handles concurrent requests without race condition leaks', async () => {
  const limiter = new MemoryRateLimiter();
  const ip = '198.51.100.42';
  const action = 'ai_gateway';
  const max = 10;
  const windowMs = 10000;

  // Simulate 50 simultaneous asynchronous callers
  const promises = Array.from({ length: 50 }, () =>
    new Promise<{ allowed: boolean }>((resolve) => {
      setImmediate(() => {
        const res = limiter.checkAndIncrement(ip, action, max, windowMs);
        resolve(res);
      });
    })
  );

  const results = await Promise.all(promises);
  const allowedCount = results.filter((r) => r.allowed).length;
  const blockedCount = results.filter((r) => !r.allowed).length;

  assert.equal(allowedCount, max, `Exactly ${max} requests must be allowed`);
  assert.equal(blockedCount, 40, 'Remaining 40 requests must be rejected with 429');
});

test('resolveClientIp rejects spoofed X-Forwarded-For from untrusted remote address', () => {
  const untrustedRemote = '203.0.113.99';
  const headers = {
    'x-forwarded-for': '8.8.8.8',
    'cf-connecting-ip': '1.1.1.1',
  };
  // Remote is not in trusted proxy list, so headers must be completely ignored
  const resolved = resolveClientIp(untrustedRemote, headers, ['127.0.0.1']);
  assert.equal(resolved, untrustedRemote);
});

test('resolveClientIp trusts CF-Connecting-IP when behind verified reverse proxy', () => {
  const trustedProxy = '10.0.0.1';
  const headers = {
    'cf-connecting-ip': '198.51.100.88',
  };
  const resolved = resolveClientIp(trustedProxy, headers, ['10.0.0.1']);
  assert.equal(resolved, '198.51.100.88');
});

test('resolveClientIp parses leftmost public IP in X-Forwarded-For when behind trusted proxy', () => {
  const trustedProxy = '127.0.0.1';
  const headers = {
    'x-forwarded-for': '198.51.100.77, 10.0.0.2',
  };
  const resolved = resolveClientIp(trustedProxy, headers, ['127.0.0.1']);
  assert.equal(resolved, '198.51.100.77');
});
