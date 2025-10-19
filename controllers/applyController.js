const Job = require('../models/Job');
const transporter = require('../config/mailer');

exports.applyJob = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      req.flash('error', 'Job not found.');
      return res.redirect('/find');
    }

    if (!job.userEmail) {
      req.flash('error', 'Recruiter email not found.');
      return res.redirect('/find');
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: job.userEmail,
      subject: `Job Application for ${job.jobName}`,
      text: `
        Applicant Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
      attachments: [],
    };

    if (req.file) {
      mailOptions.attachments.push({
        filename: req.file.originalname,
        path: req.file.path,
      });
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email error:', err);
        req.flash('error', 'Failed to send application.');
        return res.redirect(`/jobdetails/${job._id}`);
      }
      console.log('Email sent:', info.response);
      req.flash('success', 'Application sent successfully!');
      res.redirect('/find');
    });
  } catch (err) {
    console.error('Error applying:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/find');
  }
};
