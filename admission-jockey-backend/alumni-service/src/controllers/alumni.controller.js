const Alumni = require('../models/alumni.model');

exports.getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlumnusById = async (req, res) => {
  try {
    const alumnus = await Alumni.findById(req.params.alumniId);
    if (!alumnus) {
      return res.status(404).json({ message: 'Alumnus not found' });
    }
    res.json(alumnus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAlumnus = async (req, res) => {
  try {
    const alumnus = new Alumni(req.body);
    await alumnus.save();
    res.status(201).json(alumnus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.findByIdAndUpdate(req.params.alumniId, req.body, { new: true, runValidators: true });
    if (!alumnus) {
      return res.status(404).json({ message: 'Alumnus not found' });
    }
    res.json(alumnus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAlumnus = async (req, res) => {
  try {
    const alumnus = await Alumni.findByIdAndDelete(req.params.alumniId);
    if (!alumnus) {
      return res.status(404).json({ message: 'Alumnus not found' });
    }
    res.json({ message: 'Alumnus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
