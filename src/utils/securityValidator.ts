/**
 * Security and Validation Utilities
 */

export const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSemver(version: string): boolean {
  return SEMVER_REGEX.test(version.trim());
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validatePrompt(prompt: string, min = 2, max = 2000): { valid: boolean; error?: string } {
  if (typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt must be a string' };
  }
  const len = prompt.trim().length;
  if (len < min) {
    return { valid: false, error: `Prompt must be at least ${min} characters` };
  }
  if (len > max) {
    return { valid: false, error: `Prompt must not exceed ${max} characters` };
  }
  return { valid: true };
}

export function isHoneypotTriggered(hpValue?: string): boolean {
  return typeof hpValue === 'string' && hpValue.trim().length > 0;
}

export function buildCspHeader(reportOnly = true): { headerName: string; headerValue: string } {
  const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  return {
    headerName,
    headerValue: directives.join('; '),
  };
}

export function extractContactNonce(bodyNonce?: string, headerNonce?: string): string {
  if (typeof bodyNonce === 'string' && bodyNonce.trim().length > 0) {
    return bodyNonce.trim();
  }
  if (typeof headerNonce === 'string' && headerNonce.trim().length > 0) {
    return headerNonce.trim();
  }
  return '';
}

export function validatePostAuthorization(
  post: { id: number; postType: string; isRevision?: boolean; isAutosave?: boolean },
  userCanEdit: (postId: number) => boolean,
  managedTypes: string[]
): { authorized: boolean; reason?: string } {
  if (post.isRevision) {
    return { authorized: false, reason: 'revision_ignored' };
  }
  if (post.isAutosave) {
    return { authorized: false, reason: 'autosave_ignored' };
  }
  if (!managedTypes.includes(post.postType)) {
    return { authorized: false, reason: 'unmanaged_post_type' };
  }
  if (!post.id || post.id <= 0) {
    return { authorized: false, reason: 'invalid_object_id' };
  }
  if (!userCanEdit(post.id)) {
    return { authorized: false, reason: 'insufficient_object_capabilities' };
  }
  return { authorized: true };
}

