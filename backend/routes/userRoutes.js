// backend/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userControllers');
const { protect } = require('../middleware/AuthMiddleware');
const { uploadUserAvatar } = require('../middleware/upload');

const router = express.Router();

// Registro y login
router.post('/register', uploadUserAvatar.single('avatar'), userController.registerUser);
router.post('/login', userController.loginUser);

//Ver todos los usuarios
router.get('/stats', userController.getStats);

// Rutas protegidas
router.get('/profile/:id', protect, userController.getProfile);
router.put('/update/:id', protect, uploadUserAvatar.single('avatar'), userController.updateProfile);
router.delete('/delete/:id', protect, userController.deleteUser);

// ver imagen
// Obtener avatar por ID de usuario
router.get('/avatar/:id', userController.getAvatar);

module.exports = router;
