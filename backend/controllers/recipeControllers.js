const Recipe = require('../models/RecipeModel');
const path = require('path');
const fs = require('fs');

// Crear receta
const createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            category,
            diet,
            allergens,
            prepTime,
            cookTime,
            servings
        } = req.body;

        if (!title || !ingredients || !steps)
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });

        // Parseamos arrays que llegan como strings JSON
        const ingredientsParsed = JSON.parse(ingredients);
        const stepsParsed = JSON.parse(steps);
        const dietParsed = diet ? JSON.parse(diet) : [];
        const allergensParsed = allergens ? JSON.parse(allergens) : [];

        const imageCover = req.files && req.files.imageCover
            ? `/uploads/recipes/cover/${req.files.imageCover[0].filename}`
            : null;

        const images = req.files && req.files.images
            ? req.files.images.map(img => `/uploads/recipes/steps/${img.filename}`)
            : [];

        const totalTime = (Number(prepTime) || 0) + (Number(cookTime) || 0);

        const recipe = await Recipe.create({
            title,
            description,
            ingredients: ingredientsParsed,
            steps: stepsParsed,
            category,
            diet: dietParsed,
            allergens: allergensParsed,
            prepTime: prepTime ? Number(prepTime) : null,
            cookTime: cookTime ? Number(cookTime) : null,
            totalTime,
            servings: servings ? Number(servings) : null,
            imageCover,
            images,
            author: req.user._id
        });

        res.status(201).json(recipe);

    } catch (error) {
        console.error("Error en createRecipe:", error);
        res.status(500).json({ message: "Error interno al crear receta." });
    }
};


// Obtener todas las recetas (básico)
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.user._id }).populate('author', 'nickname name email');
        res.json(recipes);
    } catch (error) {
        console.error('Error en getRecipes:', error);
        res.status(500).json({ message: 'Error interno al obtener recetas.' });
    }
};
// Actualizar receta
const updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe)
            return res.status(404).json({ message: "Receta no encontrada." });

        // Solo el autor puede editar
        if (recipe.author.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "No autorizado para editar esta receta." });

        let { title, description, ingredients, steps, category, diet, allergens, prepTime, cookTime, servings } = req.body;

        // Parseo seguro
        const ingredientsParsed = ingredients ? JSON.parse(ingredients) : recipe.ingredients;
        const stepsParsed = steps ? JSON.parse(steps) : recipe.steps;
        const dietParsed = diet ? JSON.parse(diet) : recipe.diet;
        const allergensParsed = allergens ? JSON.parse(allergens) : recipe.allergens;

        // ------------ ELIMINAR IMAGEN COVER ANTIGUA SI HAY UNA NUEVA ---------------
        if (req.files && req.files.imageCover) {
            if (recipe.imageCover) {
                const oldPath = path.join(__dirname, "..", recipe.imageCover);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            recipe.imageCover = `/uploads/recipes/cover/${req.files.imageCover[0].filename}`;
        }

        // ------------ ELIMINAR IMÁGENES ANTIGUAS SI SE SUBEN NUEVAS ---------------
        if (req.files && req.files.images) {

            // Borrar todas las antiguas
            if (recipe.images && recipe.images.length > 0) {
                recipe.images.forEach(imgPath => {
                    const oldImgPath = path.join(__dirname, "..", imgPath);
                    if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
                });
            }

            // Añadir nuevas
            recipe.images = req.files.images.map(img => `/uploads/recipes/steps/${img.filename}`);
        }

        // ------------ ACTUALIZAR CAMPOS NORMALES ---------------
        recipe.title = title || recipe.title;
        recipe.description = description || recipe.description;

        recipe.ingredients = ingredientsParsed;
        recipe.steps = stepsParsed;

        recipe.category = category || recipe.category;
        recipe.diet = dietParsed;
        recipe.allergens = allergensParsed;

        recipe.prepTime = prepTime ? Number(prepTime) : recipe.prepTime;
        recipe.cookTime = cookTime ? Number(cookTime) : recipe.cookTime;

        recipe.totalTime = (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0);

        recipe.servings = servings ? Number(servings) : recipe.servings;

        await recipe.save();

        res.json(recipe);

    } catch (error) {
        console.error("Error en updateRecipe:", error);
        res.status(500).json({ message: "Error interno al actualizar receta." });
    }
};
// Obtener receta por ID
const getRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId)
            .populate('author', 'nickname name email')
            .populate('comments.user', 'name email');

        if (!recipe) {
            return res.status(404).json({ message: "Receta no encontrada." });
        }

        res.json(recipe);

    } catch (error) {
        console.error("Error en getRecipeById:", error);
        res.status(500).json({ message: "Error interno al obtener receta." });
    }
};
// Eliminar receta (DELETE /api/recipes/:id)
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: 'Receta no encontrada.' });

        // Solo el autor puede eliminar la receta
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta receta.' });
        }

        // Borrar imageCover si existe
        if (recipe.imageCover) {
            try {
                const coverPath = path.join(__dirname, '..', recipe.imageCover.replace(/^\/+/, ''));
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            } catch (err) {
                console.error('Error borrando imageCover:', err);
                // no devolvemos error por fallo al borrar archivo; seguimos con la eliminación DB
            }
        }

        // Borrar todas las images si existen
        if (Array.isArray(recipe.images) && recipe.images.length > 0) {
            for (const imgRel of recipe.images) {
                try {
                    const imgPath = path.join(__dirname, '..', imgRel.replace(/^\/+/, ''));
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                } catch (err) {
                    console.error('Error borrando image step:', err);
                    // seguimos con las demás
                }
            }
        }

        // Finalmente eliminamos el documento de la BD
        await Recipe.deleteOne({ _id: recipeId });

        return res.json({ message: 'Receta eliminada correctamente.' });
    } catch (error) {
        console.error('Error en deleteRecipe:', error);
        return res.status(500).json({ message: 'Error interno al eliminar receta.' });
    }
};
const searchRecipes = async (req, res) => {
    try {
        const { title, category, diet, allergens, maxTime, sort } = req.query;

        let filter = {};
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (category) filter.category = category;
        if (diet) filter.diet = { $in: diet.split(',') };
        if (allergens) filter.allergens = { $nin: allergens.split(',') };
        if (maxTime) filter.totalTime = { $lte: Number(maxTime) };

        let query = Recipe.find(filter).populate('author', 'name email');

        if (sort) query = query.sort({ [sort]: 1 }); // ascendente

        const recipes = await query;
        res.json(recipes);
    } catch (error) {
        console.error('Error en searchRecipes:', error);
        res.status(500).json({ message: 'Error interno en búsqueda.' });
    }
};
const getMyRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.user._id });
        res.json(recipes);
    } catch (error) {
        console.error('Error en getMyRecipes:', error);
        res.status(500).json({ message: 'Error interno al obtener tus recetas.' });
    }
};
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'nickname name email')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        console.error('Error en getAllRecipes:', error);
        res.status(500).json({ message: 'Error al obtener recetas.' });
    }
};
module.exports = {
    createRecipe,
    getRecipes,
    updateRecipe,
    getRecipeById,
    deleteRecipe,
    searchRecipes,
    getMyRecipes,
    getAllRecipes
};

