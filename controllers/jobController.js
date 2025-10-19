const Job = require('../models/Job');
const User = require('../models/User');

// Show course page (protected)
exports.getCourse = (req, res) => {
  res.render('courses.ejs');
};

// Show upload form
exports.getUploadPage = (req, res) => {
  res.render('upload.ejs');
};

// Handle job upload
exports.uploadJob = async (req, res) => {
  try {
    const {
      jobName,
      jobLocation,
      jobSkills,
      contactDetails,
      jobDescription,
      packagePerYear,
      userEmail,
    } = req.body;

    const companyImage = req.file ? req.file.filename : null;

    const newJob = new Job({
      jobName,
      jobLocation,
      jobSkills,
      contactDetails,
      jobDescription,
      packagePerYear,
      userEmail,
      companyImage,
      uploader: req.user._id,
    });

    await newJob.save();

    // Reward uploader
   
    req.flash('success', '✅ Job uploaded successfully! Wait for admin approval.');
    res.redirect('/find');
  } catch (error) {
    console.error('Error saving job:', error);
    req.flash('error', '⚠️ Error saving job details.');
    res.redirect('/upload');
  }
};

// Show all approved jobs
exports.findJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ approved: true }).sort({ createdAt: -1 });
    res.render('find.ejs', { jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    req.flash('error', 'Error fetching job listings.');
    res.redirect('/');
  }
};

// View single job (uploader only)
exports.viewJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }

    if (req.user && job.uploader && req.user._id.toString() === job.uploader._id.toString()) {
      return res.render('jobDetails', { job });
    } else {
      req.flash('error', 'Only the uploader can access this job.');
      return res.redirect('/find');
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    req.flash('error', 'Something went wrong.');
    res.redirect('/find');
  }
};

// Update job (PATCH)
exports.updateJob = async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Job updated successfully!');
    res.redirect('/find');
  } catch (error) {
    console.error('Error updating job:', error);
    req.flash('error', 'Only Uploader Can Edit');
    res.redirect('/find');
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');

    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }

    if (req.user && job.uploader && req.user._id.toString() === job.uploader._id.toString()) {
      await Job.findByIdAndDelete(req.params.id);
      req.flash('success', 'Job deleted successfully!');
      return res.redirect('/find');
    } else {
      req.flash('error', 'Only the uploader can delete this job.');
      return res.redirect('/find');
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    req.flash('error', 'Something went wrong.');
    res.redirect('/find');
  }
};

// Job details page for applying
exports.jobDetailsPage = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }

    res.render('jobDetails2', { job, user: req.user });
  } catch (err) {
    console.error('Error fetching job details:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/find');
  }
};
