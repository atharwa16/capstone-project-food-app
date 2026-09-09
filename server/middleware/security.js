import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes (login & signup)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit to 25 attempts per IP
  message: { error: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  message: { error: 'Rate limit exceeded. Please slow down your requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});
