// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true
  },
  jobLocation: {
    type: String,
    required: true
  },
  jobSkills: {
    type: String,
    required: true
  },
  contactDetails: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  packagePerYear: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  companyImage: {
    type: String,
    default: null
  },
  uploader: {  // Reference to User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {   // NEW FIELD
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
