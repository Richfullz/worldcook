// routes/commentRouter.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthMiddleware');
const commentController = require('../controllers/CommentController');

// Crear comentario
router.post('/add/:id', protect, commentController.addComment);

// Obtener comentarios de una receta
router.get('/view/:id', commentController.getCommentsByRecipe);

// Eliminar comentario
router.delete('/delete/:id', protect, commentController.deleteComment);

// Editar comentario
router.put('/update/:id', protect, commentController.editComment);

// Contar comentarios
router.get('/count/:id', commentController.getCommentsCount);

module.exports = router;
