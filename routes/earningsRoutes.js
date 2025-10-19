const express = require('express');
const router = express.Router();
const earnCtrl = require('../controllers/earningsController');

router.get('/earnings', earnCtrl.getEarnings);

module.exports = router;
