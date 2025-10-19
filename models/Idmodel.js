const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  }
});

const IdModel = mongoose.model('Id', idSchema);

module.exports = IdModel;
