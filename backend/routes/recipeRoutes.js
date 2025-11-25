const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers');
const { protect } = require('../middleware/AuthMiddleware');
const { uploadRecipeImages } = require('../middleware/upload');

router.post('/create', protect, uploadRecipeImages, recipeController.createRecipe);

//Mostrar todas las recetas o una sola
router.get('/', recipeController.getRecipes);
router.get('/view/:id', recipeController.getRecipeById);
router.get('/my', protect, recipeController.getMyRecipes);

//Editar recetas
router.put('/update/:id', protect, uploadRecipeImages, recipeController.updateRecipe);

//Eliminar receta
router.delete('/delete/:id', protect, recipeController.deleteRecipe);

//buscar receta
router.get('/search', recipeController.searchRecipes);

module.exports = router;
