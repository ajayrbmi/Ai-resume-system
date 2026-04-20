const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'hr_admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. HR Admin only.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
