// Track failed login attempts
const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
const activeReviewUploads = new Map();
const MAX_ACTIVE_REVIEW_UPLOADS = 4;
const MAX_ACTIVE_REVIEW_UPLOADS_PER_ACCOUNT = 1;
let activeReviewUploadCount = 0;

const getLoginAttemptKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  return `${ip}_${normalizeEmail(req.body.email)}`;
};

// Rate limiting for login attempts
export const loginRateLimiter = (req, res, next) => {
  const key = getLoginAttemptKey(req);
  
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

export const recordFailedAttempt = (req) => {
  const key = getLoginAttemptKey(req);
  
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
  
};

export const clearFailedAttempts = (email) => {
  // Clear all entries for this email
  for (const [key] of failedAttempts.entries()) {
    if (key.endsWith(`_${email.toLowerCase()}`)) {
      failedAttempts.delete(key);
    }
  }
};

// Bound concurrent streamed uploads globally and per authenticated account to
// prevent one account from exhausting request slots or Cloudinary capacity.
export const reviewUploadConcurrencyLimiter = (req, res, next) => {
  const key = `user:${req.user?.userId || req.ip || req.connection.remoteAddress || 'unknown'}`;
  const accountUploads = activeReviewUploads.get(key) || 0;

  if (
    activeReviewUploadCount >= MAX_ACTIVE_REVIEW_UPLOADS ||
    accountUploads >= MAX_ACTIVE_REVIEW_UPLOADS_PER_ACCOUNT
  ) {
    return res.status(429).json({
      error: 'Too many concurrent media uploads. Please wait for the current upload to finish.'
    });
  }

  activeReviewUploadCount += 1;
  activeReviewUploads.set(key, accountUploads + 1);
  let released = false;

  const release = () => {
    if (released) {
      return;
    }
    released = true;
    activeReviewUploadCount = Math.max(0, activeReviewUploadCount - 1);
    const remaining = (activeReviewUploads.get(key) || 1) - 1;
    if (remaining > 0) {
      activeReviewUploads.set(key, remaining);
    } else {
      activeReviewUploads.delete(key);
    }
  };

  res.once('finish', release);
  res.once('close', release);
  next();
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

export const normalizeEmail = (input) => {
  const sanitized = sanitizeInput(input);
  return typeof sanitized === 'string' ? sanitized.toLowerCase() : '';
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
