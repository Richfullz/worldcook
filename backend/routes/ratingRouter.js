const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthMiddleware');
const ratingController = require('../controllers/RatingController');

// Añadir o actualizar rating
router.post('/add/:id', protect, ratingController.addOrUpdateRating);

// Obtener estadísticas de rating
router.get('/get/:id', ratingController.getRatingStats);

module.exports = router;
