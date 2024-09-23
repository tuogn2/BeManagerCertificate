// CourseBundle Model
const mongoose = require('mongoose');

const courseBundleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }
  ],
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },image: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('CourseBundle', courseBundleSchema);