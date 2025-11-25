// backend/middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    } else {
        res.status(401).json({ message: 'No autorizado, token faltante' });
    }
};

module.exports = { protect };
