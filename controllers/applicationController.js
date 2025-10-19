const transporter = require('../config/mailer');
const Job = require('../models/Job');

exports.jobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('uploader');
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }
    res.render('jobDetails2', { job, user: req.user });
  } catch (err) {
    req.flash('error', 'Something went wrong.');
    res.redirect('/find');
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }
    let mailOptions = {
      from: `"${name}" <${email}>`,
      to: job.userEmail,
      subject: `Job Application for ${job.jobName}`,
      text: `Applicant Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      attachments: []
    };
    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Failed to send application.');
        return res.redirect(`/jobdetails/${job._id}`);
      }
      req.flash('success', 'Application sent successfully!');
      res.redirect('/find');
    });
  } catch (err) {
    req.flash('error', 'Something went wrong while applying.');
    res.redirect('/find');
  }
};
