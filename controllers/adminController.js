const Job = require('../models/Job');
const User = require('../models/User');

exports.getAdminDashboard = async (req, res) => {
  try {
    const jobs = await Job.find().populate('uploader').sort({ createdAt: -1 });
    res.render('admin', { jobs, success: req.flash('success'), error: req.flash('error') });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching jobs.');
    res.redirect('/');
  }
};

exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/admin');
    }

    job.approved = true;
    await job.save();

    await User.findByIdAndUpdate(job.uploader._id, { $inc: { money: 100 } });

    req.flash('success', `Job approved! ₹100 added to ${job.uploader.name}'s balance.`);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error approving job.');
    res.redirect('/admin');
  }
};

exports.toggleApproval = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/admin');
    }

    job.approved = !job.approved;
    await job.save();

    req.flash('success', `Job ${job.approved ? 'approved' : 'disapproved'} successfully!`);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error toggling approval.');
    res.redirect('/admin');
  }
};
