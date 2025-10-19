const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Save user payment details
router.post('/userpaymentdetails', async (req, res) => {
    try {
      const { courseName, paymentId, orderId, signature } = req.body;
  
      if (!courseName || !paymentId || !orderId || !signature) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
  
      const payment = new Payment({
        courseName,
        studentName: req.user.name,
        studentEmail: req.user.email,
        paymentId,
        orderId,
        signature
      });
  
      await payment.save();
  
      res.json({ success: true, message: 'Payment details saved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
// Get payment details of current logged-in user
router.get('/userpaymentdetails', async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/login'); // redirect to login if not authenticated
      }
  
      const payments = await Payment.find({ studentEmail: req.user.email }).sort({ createdAt: -1 });
      res.render('userPayments', { payments });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
