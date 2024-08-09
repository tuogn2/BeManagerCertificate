const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issueDate: { type: Date, required: true },
  expirationDate: { type: Date },
  issuer: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Hoặc 'OrganizationUser'
  blockchainHash: { type: String, unique: true, required: true }, // Hash trên blockchain để xác thực
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
