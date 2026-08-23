const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const genTokens = (id) => ({
  accessToken: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
});

const setCookie = (res, token) => res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Min 8 characters')
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  try {
    if (await User.findOne({ email: req.body.email }))
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create(req.body);
    const { accessToken, refreshToken } = genTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    setCookie(res, refreshToken);

    res.status(201).json({
      success: true, accessToken,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });

  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user?.password || !(await user.comparePassword(req.body.password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const { accessToken, refreshToken } = genTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    setCookie(res, refreshToken);

    res.json({
      success: true, accessToken,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(id).select('+refreshToken');
    if (!user || user.refreshToken !== token)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const { accessToken, refreshToken } = genTokens(id);
    await User.findByIdAndUpdate(id, { refreshToken });
    setCookie(res, refreshToken);
    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
});

// POST /api/auth/logout
router.post('/logout', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const u = req.user;
    
    // Streak Calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = u.lastActiveDate ? new Date(u.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    let newNotifications = [];
    let updated = false;

    if (!lastActive || lastActive.getTime() < today.getTime()) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive && lastActive.getTime() === yesterday.getTime()) {
        u.currentStreak += 1;
      } else {
        u.currentStreak = 1;
      }
      
      if (u.currentStreak > u.longestStreak) u.longestStreak = u.currentStreak;
      u.lastActiveDate = new Date();
      updated = true;

      // Streak Notifications
      if ([3, 7, 14, 30, 50, 100].includes(u.currentStreak)) {
        newNotifications.push({ title: 'Streak Milestone! 🔥', message: `You've logged in for ${u.currentStreak} days in a row!`, type: 'streak' });
      } else if (u.currentStreak === 1) {
        newNotifications.push({ title: 'Streak Started! 🌱', message: `You started a new learning streak today.`, type: 'streak' });
      }
    }

    if (newNotifications.length > 0) {
      u.notifications.push(...newNotifications);
    }
    
    if (updated || newNotifications.length > 0) {
      await u.save();
    }

    res.json({ 
      success: true, 
      user: { id: u._id, name: u.name, email: u.email, avatar: u.avatar, role: u.role, currentStreak: u.currentStreak, longestStreak: u.longestStreak },
      notifications: u.notifications.sort((a,b) => b.createdAt - a.createdAt)
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/auth/notifications/read
router.post('/notifications/read', protect, async (req, res) => {
  try {
    const u = req.user;
    u.notifications.forEach(n => n.read = true);
    await u.save();
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  async (req, res) => {
    const { accessToken, refreshToken } = genTokens(req.user._id);
    await User.findByIdAndUpdate(req.user._id, { refreshToken });
    setCookie(res, refreshToken);
    const u = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&name=${encodeURIComponent(u.name)}&email=${encodeURIComponent(u.email)}&avatar=${encodeURIComponent(u.avatar || '')}&id=${u._id}`);
  }
);

module.exports = router;
