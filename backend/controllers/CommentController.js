// controllers/CommentController.js
const Comment = require('../models/CommentModel');

// Crear comentario
const addComment = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: 'El comentario no puede estar vacío.' });

        const newComment = await Comment.create({
            user: userId,
            recipe: recipeId,
            text
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error en addComment:', error);
        res.status(500).json({ message: 'Error interno al agregar comentario.' });
    }
};

// Obtener comentarios de una receta
const getCommentsByRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const comments = await Comment.find({ recipe: recipeId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // últimos primero
        res.json(comments);
    } catch (error) {
        console.error('Error en getCommentsByRecipe:', error);
        res.status(500).json({ message: 'Error interno al obtener comentarios.' });
    }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado.' });

        // Solo el autor puede borrar su comentario
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'No autorizado para eliminar este comentario.' });
        }

        await Comment.deleteOne({ _id: commentId });
        res.json({ message: 'Comentario eliminado correctamente.' });
    } catch (error) {
        console.error('Error en deleteComment:', error);
        res.status(500).json({ message: 'Error interno al eliminar comentario.' });
    }
};
// Editar comentario
const editComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;
        const { text } = req.body;

        if (!text || text.length > 500) {
            return res.status(400).json({ message: 'Comentario inválido. Máximo 500 caracteres.' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comentario no encontrado.' });

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'No autorizado para editar este comentario.' });
        }

        comment.text = text;
        await comment.save();

        res.json(comment);
    } catch (error) {
        console.error('Error en editComment:', error);
        res.status(500).json({ message: 'Error interno al editar comentario.' });
    }
};
const getCommentsCount = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const count = await Comment.countDocuments({ recipe: recipeId });
        return res.json({ count });
    } catch (error) {
        console.error('Error en getCommentsCount:', error);
        res.status(500).json({ message: 'Error interno al contar comentarios.' });
    }
};

module.exports = { addComment, getCommentsByRecipe, deleteComment, editComment, getCommentsCount };
