const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },        // rename courseName → title
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },        // store as number (0, 1000, etc.)
  
});

module.exports = mongoose.model('Course', courseSchema);
