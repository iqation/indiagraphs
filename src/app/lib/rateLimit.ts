const loginAttempts = new Map<string, { count: number; expiresAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW = 5 * 60 * 1000; // 5 minutes

export function rateLimit(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  // If first attempt → create entry
  if (!entry) {
    loginAttempts.set(ip, { count: 1, expiresAt: now + WINDOW });
    return { allowed: true };
  }

  // If window expired → reset
  if (entry.expiresAt < now) {
    loginAttempts.set(ip, { count: 1, expiresAt: now + WINDOW });
    return { allowed: true };
  }

  // If within rate limit window
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = entry.expiresAt - now;
    const retryAfterMinutes = Math.ceil(retryAfterMs / (60 * 1000));

    return { allowed: false, retryAfter: retryAfterMinutes };
  }

  // Increment attempt count
  entry.count++;
  loginAttempts.set(ip, entry);

  return { allowed: true };
}
