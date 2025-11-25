const Rating = require('../models/RatingModel');

// Añadir o actualizar valoración
const addOrUpdateRating = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;
        const { score } = req.body;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ message: 'Puntuación inválida. Debe estar entre 1 y 5.' });
        }

        // Revisar si el usuario ya valoró la receta
        let rating = await Rating.findOne({ user: userId, recipe: recipeId });

        if (rating) {
            rating.score = score; // actualizar
            await rating.save();
        } else {
            rating = await Rating.create({ user: userId, recipe: recipeId, score });
        }

        res.json(rating);
    } catch (error) {
        console.error('Error en addOrUpdateRating:', error);
        res.status(500).json({ message: 'Error interno al agregar/actualizar rating.' });
    }
};

// Obtener promedio y total de valoraciones de una receta
const getRatingStats = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const ratings = await Rating.find({ recipe: recipeId });

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? (ratings.reduce((acc, r) => acc + r.score, 0) / totalRatings).toFixed(2) : 0;

        res.json({ totalRatings, averageRating });
    } catch (error) {
        console.error('Error en getRatingStats:', error);
        res.status(500).json({ message: 'Error interno al obtener estadísticas de rating.' });
    }
};

module.exports = { addOrUpdateRating, getRatingStats };
