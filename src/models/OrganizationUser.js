const mongoose = require('mongoose');

const OrganizationUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  lastModified: { type: Date, default: Date.now },
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }] // Chứng chỉ mà người dùng này sở hữu
});

module.exports = mongoose.model('OrganizationUser', OrganizationUserSchema);
