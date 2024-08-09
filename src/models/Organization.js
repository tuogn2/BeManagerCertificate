const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationUser' }],
  certificatesIssued: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }] // Các chứng chỉ mà tổ chức đã cấp
});

module.exports = mongoose.model('Organization', OrganizationSchema);
