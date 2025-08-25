const mongoose = require('mongoose');

const chooseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleDescription: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Choose', chooseSchema);
