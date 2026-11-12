/**
 * Rate Limiter Pure Logic & Proxy Verification Engine
 */
import crypto from 'node:crypto';

export interface RateBucket {
  count: number;
  resetAt: number;
}

export interface RateCheckResult {
  allowed: boolean;
  current: number;
  max: number;
  retryAfter: number;
}

/**
 * In-memory thread-safe atomic counter map
 */
export class MemoryRateLimiter {
  private buckets = new Map<string, RateBucket>();
  private salt: string;

  constructor(salt = 'sahand_test_salt') {
    this.salt = salt;
  }

  public hashClient(ip: string): string {
    return crypto.createHash('sha256').update(`${ip}|${this.salt}`).digest('hex');
  }

  public checkAndIncrement(ip: string, action: string, maxRequests: number, windowMs: number, now = Date.now()): RateCheckResult {
    const ipHash = this.hashClient(ip);
    const key = `${action}:${ipHash}`;

    let bucket = this.buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        current: 1,
        max: maxRequests,
        retryAfter: 0,
      };
    }

    if (bucket.count >= maxRequests) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      return {
        allowed: false,
        current: bucket.count,
        max: maxRequests,
        retryAfter,
      };
    }

    bucket.count += 1;
    return {
      allowed: true,
      current: bucket.count,
      max: maxRequests,
      retryAfter: 0,
    };
  }

  public clear(): void {
    this.buckets.clear();
  }
}

/**
 * Resolve client IP with trusted proxy verification
 * Never trusts arbitrary X-Forwarded-For unless remoteAddr matches trusted proxy list
 */
export function resolveClientIp(
  remoteAddr: string,
  headers: Record<string, string | undefined>,
  trustedProxies: string[] = ['127.0.0.1', '::1', '10.0.0.1']
): string {
  const isTrusted = trustedProxies.includes(remoteAddr);

  if (isTrusted) {
    // 1. Cloudflare header
    const cfIp = headers['cf-connecting-ip'];
    if (cfIp && isValidIp(cfIp)) {
      return cfIp.trim();
    }

    // 2. Verified X-Forwarded-For
    const xff = headers['x-forwarded-for'];
    if (xff) {
      const parts = xff.split(',').map((p) => p.trim());
      for (const candidate of parts) {
        if (isValidIp(candidate) && !isPrivateIp(candidate)) {
          return candidate;
        }
      }
    }
  }

  // Untrusted proxy or direct connection: rely strictly on remoteAddr
  return isValidIp(remoteAddr) ? remoteAddr : '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // Simple IPv4 / IPv6 validation
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const ipv6Regex = /^[0-9a-fA-F:]+$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function isPrivateIp(ip: string): boolean {
  return ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.') || ip === '127.0.0.1' || ip === '::1';
}
