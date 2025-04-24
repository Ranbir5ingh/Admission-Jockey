const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  avatarUrl: { type: String },
  preferences: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preferences'
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
