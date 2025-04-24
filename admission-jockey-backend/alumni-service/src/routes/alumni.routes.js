const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumni.controller');

// Get all alumni
router.get('/', alumniController.getAlumni);

// Get alumnus by ID
router.get('/:alumniId', alumniController.getAlumnusById);

// Create new alumnus
router.post('/', alumniController.createAlumnus);

// Update alumnus by ID
router.put('/:alumniId', alumniController.updateAlumnus);

// Delete alumnus by ID
router.delete('/:alumniId', alumniController.deleteAlumnus);

module.exports = router;
