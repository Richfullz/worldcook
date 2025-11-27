// favoriteRouter.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthMiddleware');
const favoriteController = require('../controllers/FavoriteController');

router.post('/toggle/:id', protect, favoriteController.toggleFavorite);
router.get('/count/:id', favoriteController.getFavoritesCount);
router.get('/my', protect, favoriteController.getMyFavorites);
router.get('/status/:id', protect, favoriteController.getFavoriteStatus);

module.exports = router;