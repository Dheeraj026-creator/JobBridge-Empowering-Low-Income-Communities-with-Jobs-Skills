const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RPAY_KEY_ID,
  key_secret: process.env.RPAY_KEY_SECRET
});

// Create order route
router.post('/create-order', async (req, res) => {
  try {
    const { courseId, amount, studentName, studentEmail } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: 'Unable to create order' });
  }
});

module.exports = router;
