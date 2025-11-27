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

const getFavoritesCount = async (req, res) => {
    try {
        const count = await Favorite.countDocuments({ recipe: req.params.id });
        return res.json({ count });
    } catch (error) {
        console.error('Error en getFavoritesCount:', error);
        return res.status(500).json({ message: 'Error interno al obtener favoritos.' });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const list = await Favorite.find({ user: req.user._id })
            .populate('recipe', 'title imageCover totalTime')
            .sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener favoritos.' });
    }
};

const getFavoriteStatus = async (req, res) => {
    try {
        const fav = await Favorite.findOne({ user: req.user._id, recipe: req.params.id });
        res.json({ favorited: !!fav });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener estado de favorito.' });
    }
};

module.exports = {
    toggleFavorite,
    getFavoritesCount,
    getMyFavorites,
    getFavoriteStatus
};