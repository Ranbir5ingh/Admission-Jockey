const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  college: { type: String, required: true },
  degree: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  bio: { type: String },
  profilePictureUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
