const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

const Earnings = mongoose.model('Earnings', earningsSchema);

module.exports = Earnings;
