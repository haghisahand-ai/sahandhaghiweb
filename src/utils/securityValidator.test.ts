import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSemver,
  validateEmail,
  validatePrompt,
  isHoneypotTriggered,
  buildCspHeader,
  extractContactNonce,
  validatePostAuthorization,
} from './securityValidator';

test('validateSemver accurately validates standard and prerelease SemVer strings', () => {
  assert.equal(validateSemver('1.0.0'), true);
  assert.equal(validateSemver('2.14.3-alpha.1'), true);
  assert.equal(validateSemver('0.9.1+20261111'), true);

  assert.equal(validateSemver('1.0'), false);
  assert.equal(validateSemver('v1.0.0'), false);
  assert.equal(validateSemver('1.0.0; rm -rf /'), false);
  assert.equal(validateSemver('<script>'), false);
});

test('validateEmail validates RFC compliant email addresses', () => {
  assert.equal(validateEmail('haghisahnd@gmail.com'), true);
  assert.equal(validateEmail('admin@sahandhaghi.site'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('@domain.com'), false);
  assert.equal(validateEmail('name@'), false);
});

test('validatePrompt enforces min and max length boundaries', () => {
  assert.equal(validatePrompt('Valid technical prompt').valid, true);
  assert.equal(validatePrompt('A').valid, false); // Less than 2
  assert.equal(validatePrompt('   ').valid, false);

  const longPrompt = 'A'.repeat(2001);
  assert.equal(validatePrompt(longPrompt).valid, false); // Exceeds 2000

  const maxPrompt = 'A'.repeat(2000);
  assert.equal(validatePrompt(maxPrompt).valid, true);
});

test('isHoneypotTriggered identifies spam bots filling invisible input', () => {
  assert.equal(isHoneypotTriggered(''), false);
  assert.equal(isHoneypotTriggered(undefined), false);
  assert.equal(isHoneypotTriggered('   '), false);
  assert.equal(isHoneypotTriggered('spam-bot-value'), true);
});

test('buildCspHeader generates valid directive string and respects report-only mode', () => {
  const reportOnly = buildCspHeader(true);
  assert.equal(reportOnly.headerName, 'Content-Security-Policy-Report-Only');
  assert.ok(reportOnly.headerValue.includes("default-src 'self'"));
  assert.ok(reportOnly.headerValue.includes('https://generativelanguage.googleapis.com'));

  const enforced = buildCspHeader(false);
  assert.equal(enforced.headerName, 'Content-Security-Policy');
});

test('extractContactNonce resolves nonce from body, header, or returns empty string', () => {
  assert.equal(extractContactNonce('body_nonce_123', undefined), 'body_nonce_123');
  assert.equal(extractContactNonce('', 'header_nonce_456'), 'header_nonce_456');
  assert.equal(extractContactNonce(undefined, 'header_nonce_789'), 'header_nonce_789');
  assert.equal(extractContactNonce('', ''), '');
  assert.equal(extractContactNonce(undefined, undefined), '');
});

test('validatePostAuthorization enforces object-level permissions, revision, and post type boundaries', () => {
  const managed = ['sahand_project', 'sahand_product', 'sahand_ai_tool', 'sahand_insight'];
  const userPerms = (id: number) => id === 42 || id === 100; // user can only edit post 42 or 100

  // 1. Authorized post
  assert.deepEqual(
    validatePostAuthorization({ id: 42, postType: 'sahand_project' }, userPerms, managed),
    { authorized: true }
  );

  // 2. Unauthorized post ID (horizontal privilege escalation attempt)
  assert.deepEqual(
    validatePostAuthorization({ id: 999, postType: 'sahand_project' }, userPerms, managed),
    { authorized: false, reason: 'insufficient_object_capabilities' }
  );

  // 3. Revisions and autosaves are rejected
  assert.deepEqual(
    validatePostAuthorization({ id: 42, postType: 'sahand_project', isRevision: true }, userPerms, managed),
    { authorized: false, reason: 'revision_ignored' }
  );
  assert.deepEqual(
    validatePostAuthorization({ id: 42, postType: 'sahand_project', isAutosave: true }, userPerms, managed),
    { authorized: false, reason: 'autosave_ignored' }
  );

  // 4. Unmanaged post types rejected
  assert.deepEqual(
    validatePostAuthorization({ id: 42, postType: 'post' }, userPerms, managed),
    { authorized: false, reason: 'unmanaged_post_type' }
  );

  // 5. Invalid / zero ID
  assert.deepEqual(
    validatePostAuthorization({ id: 0, postType: 'sahand_project' }, userPerms, managed),
    { authorized: false, reason: 'invalid_object_id' }
  );
});

