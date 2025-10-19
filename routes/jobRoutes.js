const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { authentication } = require('../middleware/authMiddleware');
const {
  getCourse,
  getUploadPage,
  uploadJob,
  findJobs,
  viewJob,
  updateJob,
  deleteJob,
  jobDetailsPage,
} = require('../controllers/jobController');

router.get('/course', authentication, getCourse);
router.get('/upload', authentication, getUploadPage);
router.post('/upload', authentication, upload.single('companyImage'), uploadJob);

router.get('/find', findJobs);
router.get('/job/:id', authentication, viewJob);
router.patch('/update/:id', updateJob);
router.delete('/delete/:id', deleteJob);

router.get('/jobdetails/:id', jobDetailsPage);

module.exports = router;
