const Like = require('../models/LikeModel');
const Recipe = require('../models/RecipeModel');

const toggleLike = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;

        // Revisar si ya existe un like
        const existingLike = await Like.findOne({ user: userId, recipe: recipeId });

        if (existingLike) {
            // Quitar like
            await existingLike.deleteOne();
            return res.json({ liked: false });
        } else {
            // Crear like
            const newLike = await Like.create({ user: userId, recipe: recipeId });
            return res.json({ liked: true });
        }

    } catch (error) {
        console.error('Error en toggleLike:', error);
        return res.status(500).json({ message: 'Error interno al dar like.' });
    }
};

// Contar likes por receta
const getLikesCount = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const likesCount = await Like.countDocuments({ recipe: recipeId });
        return res.json({ likesCount });
    } catch (error) {
        console.error('Error en getLikesCount:', error);
        return res.status(500).json({ message: 'Error interno al obtener likes.' });
    }
};

module.exports = { toggleLike, getLikesCount };
