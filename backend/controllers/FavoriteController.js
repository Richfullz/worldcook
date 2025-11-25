// controllers/FavoriteController.js
const Favorite = require('../models/FavoriteModel');

const toggleFavorite = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;

        const existingFavorite = await Favorite.findOne({ user: userId, recipe: recipeId });

        if (existingFavorite) {
            await existingFavorite.deleteOne();
            return res.json({ favorited: false });
        } else {
            await Favorite.create({ user: userId, recipe: recipeId });
            return res.json({ favorited: true });
        }
    } catch (error) {
        console.error('Error en toggleFavorite:', error);
        return res.status(500).json({ message: 'Error interno al agregar/quitar favorito.' });
    }
};

// Contar favoritos de una receta
const getFavoritesCount = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const count = await Favorite.countDocuments({ recipe: recipeId });
        return res.json({ count });
    } catch (error) {
        console.error('Error en getFavoritesCount:', error);
        return res.status(500).json({ message: 'Error interno al obtener favoritos.' });
    }
};

module.exports = { toggleFavorite, getFavoritesCount };
