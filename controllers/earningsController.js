const User = require('../models/User');

exports.getEarnings = async (req, res) => {
  try {
    const users = await User.find().sort({ money: -1 });
    res.render('earnings', { users });
  } catch {
    req.flash('error', 'Unable to fetch earnings.');
    res.redirect('/');
  }
};
