const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/applicationController');
const { resumeUpload } = require('../middleware/multerConfig');

router.get('/jobdetails/:id', appCtrl.jobDetails);
router.post('/apply/:id', resumeUpload.single('resume'), appCtrl.applyJob);

module.exports = router;
