const express = require('express');
const router = express.Router();
const { getSignup, getLogin, signup, login, logout } = require('../controllers/authController');

router.get('/signup', getSignup);
router.post('/signup', signup);

router.get('/login', getLogin);
router.post('/login', login);

router.post('/logout', logout);

module.exports = router;
