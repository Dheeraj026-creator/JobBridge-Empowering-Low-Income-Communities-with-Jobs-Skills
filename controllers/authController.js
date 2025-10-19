const User = require('../models/User');
const IdModel = require('../models/Idmodel');
const passport = require('passport');

exports.getSignup = (req, res) => res.render('signup.ejs');
exports.getLogin = (req, res) => res.render('login.ejs');

exports.signup = async (req, res) => {
  const { name, email, id, phoneNumber, password } = req.body;

  try {
    const idExists = await IdModel.findOne({ id: Number(id) });
    if (!idExists) {
      req.flash('error', 'Invalid ID.');
      return res.redirect('/signup');
    }

    if (await User.findOne({ id })) {
      req.flash('error', 'ID already in use.');
      return res.redirect('/signup');
    }

    if (await User.findOne({ email })) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/signup');
    }

    const newUser = new User({ name, email, id, phoneNumber });
    User.register(newUser, password, (err, user) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/signup');
      }
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome ${user.name}!`);
        res.redirect('/');
      });
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error.');
    res.redirect('/signup');
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, () => {
    if (req.user.id === 55) {
      req.flash('success', `Welcome Admin ${req.user.name}!`);
      return res.redirect('/admin');
    }
    req.flash('success', `Welcome back, ${req.user.name}!`);
    res.redirect('/');
  });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully.');
    res.redirect('/');
  });
};
