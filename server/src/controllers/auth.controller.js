import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { OAuth2Client } from 'google-auth-library';
import {
  sanitizeInput,
  normalizeEmail,
  isValidEmail,
  isStrongPassword,
  clearFailedAttempts,
  recordFailedAttempt
} from '../middleware/security.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const BCRYPT_ROUNDS = 12; // Increased from default 10

const signToken = (user) => jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const serializeUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role
});

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sanitize inputs
    const sanitizedEmail = normalizeEmail(email);
    const sanitizedName = sanitizeInput(firstName || '');
    const sanitizedLastName = sanitizeInput(lastName || '');

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password with increased rounds
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        firstName: sanitizedName,
        lastName: sanitizedLastName,
        role: 'user'
      }
    });

    const token = signToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sanitize email
    const sanitizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (!user) {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid) {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(user.email);

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        zipCode: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone, address, city, zipCode } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        city: city !== undefined ? city : undefined,
        zipCode: zipCode !== undefined ? zipCode : undefined
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        zipCode: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      return res.status(500).json({ 
        error: 'Google OAuth не налаштовано. Додайте GOOGLE_CLIENT_ID в .env файлі серверу.' 
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || '',
          lastName: family_name || '',
          provider: 'google',
          providerId: googleId,
          role: 'user'
        }
      });
    } else if (user.provider !== 'google' || user.providerId !== googleId) {
      return res.status(400).json({ error: 'Email already registered with different provider' });
    }

    const jwtToken = signToken(user);

    res.json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

export const facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Facebook access token is required' });
    }

    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    if (
      !facebookAppId ||
      !facebookAppSecret ||
      facebookAppId.startsWith('your-') ||
      facebookAppSecret.startsWith('your-')
    ) {
      return res.status(503).json({ error: 'Facebook OAuth is not configured on the server' });
    }

    const debugQuery = new URLSearchParams({
      input_token: accessToken,
      access_token: `${facebookAppId}|${facebookAppSecret}`
    });
    const debugResponse = await fetch(
      `https://graph.facebook.com/debug_token?${debugQuery.toString()}`
    );

    if (!debugResponse.ok) {
      return res.status(401).json({ error: 'Invalid Facebook access token' });
    }

    const debugPayload = await debugResponse.json();
    const debugData = debugPayload?.data;
    if (
      !debugData?.is_valid ||
      String(debugData.app_id) !== String(facebookAppId) ||
      !debugData.user_id
    ) {
      return res.status(401).json({ error: 'Invalid Facebook access token' });
    }

    const profileQuery = new URLSearchParams({
      fields: 'id,name,email,first_name,last_name',
      access_token: accessToken
    });
    const facebookResponse = await fetch(
      `https://graph.facebook.com/me?${profileQuery.toString()}`
    );

    if (!facebookResponse.ok) {
      return res.status(401).json({ error: 'Invalid Facebook access token' });
    }

    const facebookData = await facebookResponse.json();
    const { id: facebookId, email, first_name, last_name } = facebookData;

    if (!email || String(facebookId) !== String(debugData.user_id)) {
      return res.status(401).json({ error: 'Invalid Facebook account data' });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName: first_name || '',
          lastName: last_name || '',
          provider: 'facebook',
          providerId: facebookId,
          role: 'user'
        }
      });
    } else if (user.provider !== 'facebook' || user.providerId !== facebookId) {
      return res.status(400).json({ error: 'Email already registered with different provider' });
    }

    const token = signToken(user);

    res.json({
      message: 'Facebook authentication successful',
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ error: 'Facebook authentication failed' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.provider !== 'email') {
      return res.status(400).json({ 
        error: 'Password change is only available for email accounts' 
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 }
      }
    });

    // The caller receives a new session; every previous JWT carries an older
    // tokenVersion and is rejected by authMiddleware.
    res.json({
      message: 'Password changed successfully',
      token: signToken(updatedUser),
      user: serializeUser(updatedUser)
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
