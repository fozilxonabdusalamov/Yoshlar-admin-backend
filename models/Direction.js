const mongoose = require('mongoose');

const directionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  lessonDuration: {
    type: String,
    required: true
  },
  lessonDays: {
    type: String,
    required: true
  },
  ageRange: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Direction', directionSchema);
