// models/User.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {              // used as login
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  money: {
    type: Number,
    default: 0 // default balance
  }
}, {
  timestamps: true
});

// Add passport-local-mongoose plugin
// This adds 'hash' and 'salt' fields for password
// We tell it to use email as the username field
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;
