const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const { getAdminDashboard, approveJob, toggleApproval } = require('../controllers/adminController');
const Course = require('../models/Course');
const Payment=require('../models/Payment');
// Middleware to check if admin


// Render add course form

router.get('/', isAdmin, getAdminDashboard);
router.post('/approve/:id', isAdmin, approveJob);
router.post('/toggle-approve/:id', isAdmin, toggleApproval);
router.get('/addcourse', isAdmin, (req, res) => {
    res.render('adminAddCourse', { error: req.flash('error'), success: req.flash('success') });
  });
  router.post('/addcourse', isAdmin, async (req, res) => {
  try {
    const { title, description, duration, price } = req.body;

    // Validate required fields
    if (!title || !description || !duration || !price ) {
      req.flash('error', 'All fields are required!');
      return res.redirect('/admin/addcourse');
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      duration,
      price: Number(price), // ensure number type
      
    });

    await newCourse.save();

    req.flash('success', 'Course added successfully!');
    res.redirect('/admin/addcourse');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error adding course.');
    res.redirect('/admin/addcourse');
  }
});
router.get('/billingdetails', isAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.render('adminBilling', { payments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
