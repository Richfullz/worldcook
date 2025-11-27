const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const likeRouter = require('./routes/likeRouter');
const recipeRouter = require('./routes/recipeRoutes')
const favoriteRouter = require('./routes/favoriteRouter');
const commentRouter = require('./routes/commentRouter');
const ratingRouter = require('./routes/ratingRouter');

const app = express();
app.use(cors());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir carpeta uploads como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger simple
app.use((req, res, next) => {
    next();
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/likes', likeRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/comments', commentRouter);
app.use('/api/ratings', ratingRouter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos✅'))
    .catch(err => console.error('Error al conectar❌', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT} 😉`));
