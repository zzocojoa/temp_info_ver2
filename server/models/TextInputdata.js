// server/models/TextInputdata.js

const mongoose = require('mongoose');

const ClientInputSchema = new mongoose.Schema({
  textData: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClientInput', ClientInputSchema);