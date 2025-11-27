// controllers/LikeController.js
const Like = require('../models/LikeModel');

const toggleLike = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;

        const existingLike = await Like.findOne({ user: userId, recipe: recipeId });

        if (existingLike) {
            await existingLike.deleteOne();
            return res.json({ liked: false });
        } else {
            await Like.create({ user: userId, recipe: recipeId });
            return res.json({ liked: true });
        }
    } catch (error) {
        console.error('Error en toggleLike:', error);
        return res.status(500).json({ message: 'Error interno al dar like.' });
    }
};

const getLikesCount = async (req, res) => {
    try {
        const likesCount = await Like.countDocuments({ recipe: req.params.id });
        return res.json({ likesCount });
    } catch (error) {
        console.error('Error en getLikesCount:', error);
        return res.status(500).json({ message: 'Error interno al obtener likes.' });
    }
};

const getLikesList = async (req, res) => {
    try {
        const likes = await Like.find({ recipe: req.params.id })
            .populate('user', 'nickname name')
            .select('user createdAt')
            .sort({ createdAt: -1 });
        res.json(likes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener likes.' });
    }
};

const getLikeStatus = async (req, res) => {
    try {
        const like = await Like.findOne({ user: req.user._id, recipe: req.params.id });
        res.json({ liked: !!like });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener estado de like.' });
    }
};

module.exports = {
    toggleLike,
    getLikesCount,
    getLikesList,
    getLikeStatus
};