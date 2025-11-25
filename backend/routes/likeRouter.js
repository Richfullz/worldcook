const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthMiddleware');
const likeController = require('../controllers/LikeController');

router.post('/toggle/:id', protect, likeController.toggleLike);
router.get('/count/:id', likeController.getLikesCount);

module.exports = router;
