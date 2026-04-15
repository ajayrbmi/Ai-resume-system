const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Razorpay instance function to guarantee env vars are loaded
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your-key-id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your-key-secret'
  });
};

// @desc    Create a new order
// @route   POST /api/payment/orders
router.post('/orders', auth, async (req, res) => {
  try {
    const options = {
      amount: 99 * 100, // amount in smallest currency unit (paise) -> 9900 paise = ₹99
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Empty response from Razorpay" });
    }

    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    // Razorpay sends error inside error.error sometimes
    const errorMsg = error.error ? error.error.description : error.message;
    res.status(500).json({ message: errorMsg || 'Unknown Razorpay Error' });
  }
});

// @desc    Verify payment signature & upgrade plan
// @route   POST /api/payment/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful, upgrade user plan to PRO
      const user = await User.findById(req.user.id);
      if(user) {
        user.plan = 'pro';
        await user.save();
      }
      return res.status(200).json({ message: "Payment verified successfully", user });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
