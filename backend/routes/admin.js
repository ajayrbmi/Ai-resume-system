const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// @desc    Get global admin stats
// @route   GET /api/admin/stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const resumeCount = await Resume.countDocuments();
    
    const reports = await Report.find();
    const avgScore = reports.length > 0 
      ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / reports.length) 
      : 0;

    res.json({
      success: true,
      stats: {
        users: userCount,
        jobs: jobCount,
        resumes: resumeCount,
        avgScore: `${avgScore}%`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user plan/role/status
// @route   PUT /api/admin/users/:id
router.put('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const { plan, role, status } = req.body;
    const user = await User.findById(req.user.id);
    
    // Prevent admin from removing their own admin role or banning themselves
    if (req.params.id === req.user.id && (role === 'recruiter' || status === 'banned')) {
        return res.status(400).json({ message: "You cannot change your own admin role or ban yourself." });
    }

    const updateData = {};
    if (plan) updateData.plan = plan;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
        return res.status(400).json({ message: "You cannot delete yourself." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
