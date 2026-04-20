const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin');
const router = express.Router();

// @desc    Signup
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine role based on email for easy testing
    const role = email.includes('hradmin') ? 'hr_admin' : 'recruiter';

    // Create user
    const user = await User.create({ name, email, password, role });
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been suspended by Admin' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been suspended by Admin' });
    }
    
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Google Login via Firebase
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing token' });

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user && user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been suspended by Admin' });
    }

    if (!user) {
      // Create user if not exists
      user = await User.create({
        name: name || 'Google User',
        email,
        password: uid, // random dummy password
        googleId: uid,
        avatar: picture
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Google authentication failed. Please verify FIREBASE_PROJECT_ID in backend.' });
  }
});

// @desc    Update current user profile
// @route   PUT /api/auth/me
router.put('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();
    
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
