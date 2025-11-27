const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers');
const { protect } = require('../middleware/AuthMiddleware');
const { uploadRecipeImages } = require('../middleware/upload');

router.post('/create', protect, uploadRecipeImages, recipeController.createRecipe);
router.get('/my', protect, recipeController.getMyRecipes);

router.get('/view/:id', recipeController.getRecipeById);
router.put('/update/:id', protect, uploadRecipeImages, recipeController.updateRecipe);
router.delete('/delete/:id', protect, recipeController.deleteRecipe);
router.get('/search', recipeController.searchRecipes);
//mostrar todas las recetas a nivel global
router.get('/all', recipeController.getAllRecipes);
module.exports = router;