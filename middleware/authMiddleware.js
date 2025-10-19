function authentication(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/login');
  }
  
  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.id === 55) return next();
    req.flash('error', 'Access denied. Admins only.');
    res.redirect('/');
  }
  
  module.exports = { authentication, isAdmin };
  