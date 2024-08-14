
  const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    birthday: { type: Date },
    numberphone: { type: String, trim: true },
    address: { type: String, trim: true },
    avt: { type: String },  // Lưu đường dẫn tới ảnh đại diện
    createdAt: { type: Date, default: Date.now },
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }]
  });

  module.exports = mongoose.model('User', UserSchema);
