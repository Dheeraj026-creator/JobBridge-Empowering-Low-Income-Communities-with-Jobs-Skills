const express = require('express');
const router = express.Router();
const { resumeUpload } = require('../middleware/uploadMiddleware');
const { applyJob } = require('../controllers/applyController');

router.post('/apply/:id', resumeUpload.single('resume'), applyJob);

module.exports = router;
