// Track failed login attempts
const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Rate limiting for login attempts
export const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const email = req.body.email?.toLowerCase();
  const key = `${ip}_${email}`;
  
  const attempts = failedAttempts.get(key);
  
  if (attempts) {
    const timeSinceFirstAttempt = Date.now() - attempts.firstAttempt;
    
    if (attempts.count >= MAX_ATTEMPTS) {
      if (timeSinceFirstAttempt < LOCKOUT_TIME) {
        const remainingTime = LOCKOUT_TIME - timeSinceFirstAttempt;
        const minutes = Math.ceil(remainingTime / 60000);
        return res.status(429).json({ 
          error: `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` 
        });
      } else {
        // Reset after lockout period
        failedAttempts.delete(key);
      }
    }
  }
  
  next();
};

export const recordFailedAttempt = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const email = req.body.email?.toLowerCase();
  const key = `${ip}_${email}`;
  
  const attempts = failedAttempts.get(key);
  
  if (attempts) {
    attempts.count++;
    failedAttempts.set(key, attempts);
  } else {
    failedAttempts.set(key, {
      count: 1,
      firstAttempt: Date.now()
    });
  }
  
  // Clean old entries every hour
  if (failedAttempts.size > 1000) {
    const now = Date.now();
    for (const [k, v] of failedAttempts.entries()) {
      if (now - v.firstAttempt > LOCKOUT_TIME) {
        failedAttempts.delete(k);
      }
    }
  }
  
  next();
};

export const clearFailedAttempts = (email) => {
  // Clear all entries for this email
  for (const [key] of failedAttempts.entries()) {
    if (key.endsWith(`_${email.toLowerCase()}`)) {
      failedAttempts.delete(key);
    }
  }
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Allow only the storefront itself plus Google Identity and Google Fonts.
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src https://accounts.google.com; connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com"
  );
  
  next();
};

// Input sanitization helper
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 6) return false;
  if (password.length > 128) return false;
  return true;
};
