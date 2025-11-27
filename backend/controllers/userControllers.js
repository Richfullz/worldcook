// backend/controllers/userController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Recipe = require('../models/RecipeModel')

// Generar token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registro
const registerUser = async (req, res) => {
    try {
        let { name, lastName, nickname, email, password, bio } = req.body;
        let avatar = '';

        if (req.file) {
            avatar = `/uploads/users/${req.file.filename}`;
        }

        if (!name || !lastName || !nickname || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos' });
        }

        const existsUser = await User.findOne({ $or: [{ email }, { nickname }] });
        if (existsUser) return res.status(400).json({ message: 'Email o nickname ya registrado' });

        // Hasheamos la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            lastName,
            nickname,
            email,
            password: hashedPassword, // Guardamos hasheada
            avatar,
            bio
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            nickname: user.nickname,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            roles: user.roles,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Error en registerUser:', error);
        res.status(500).json({ message: 'Losentimos, Algo no funcionó bien' });
    }
};


// Login
const loginUser = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const user = await User.findOne({ $or: [{ email: login }, { nickname: login }] });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Comparamos la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Todo correcto, devolvemos usuario + token
        return res.json({
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            nickname: user.nickname,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            roles: user.roles,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Error en loginUser:', error);
        res.status(500).json({ message: 'Losentimos, Algo no funcionó bien' });
    }
};

// Obtener perfil
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        // Comprobamos que el usuario existe
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Devolvemos todos los datos
        res.json(user);
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

// Actualizar perfil
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const { name, lastName, nickname, email, bio, password } = req.body;

        if (name) user.name = name;
        if (lastName) user.lastName = lastName;

        if (nickname && nickname !== user.nickname) {
            const existsNick = await User.findOne({ nickname });
            if (existsNick) return res.status(400).json({ message: 'Nickname ya en uso' });
            user.nickname = nickname;
        }

        if (email && email !== user.email) {
            const existsEmail = await User.findOne({ email });
            if (existsEmail) return res.status(400).json({ message: 'Email ya en uso' });
            user.email = email;
        }

        if (bio) user.bio = bio;

        if (req.file) {
            if (user.avatar) {
                const oldPath = path.join(__dirname, '..', user.avatar.replace(/^\/+/, ''));
                try {
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                } catch (err) {
                    console.error('Error al borrar avatar antiguo:', err);
                }
            }
            user.avatar = `/uploads/users/${req.file.filename}`;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            nickname: user.nickname,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            roles: user.roles,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({ message: 'Losentimos, Algo no funcionó bien' });
    }

};

// Eliminar cuenta
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Borrar avatar si existe
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', user.avatar.replace(/^\/+/, ''));
            try {
                if (fs.existsSync(avatarPath)) {
                    fs.unlinkSync(avatarPath);
                }
            } catch (err) {
                console.error('Error al borrar avatar del usuario:', err);
            }
        }

        // Eliminar el usuario de la DB
        await User.deleteOne({ _id: user._id });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({ message: 'Losentimos, Algo no funcionó bien' });
    }
};

//subir una imagen
const getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) return res.status(404).json({ message: 'Avatar no encontrado' });

        // Construimos la ruta correcta del archivo
        const avatarPath = path.join(__dirname, '..', user.avatar.replace(/^\/+/, ''));

        if (!fs.existsSync(avatarPath)) return res.status(404).json({ message: 'Archivo no encontrado' });

        res.sendFile(avatarPath);
    } catch (error) {
        console.error('Error en getAvatar:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
// Stats públicas
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRecipes = await Recipe.countDocuments();
        return res.json({ totalUsers, totalRecipes, uniqueCountries: 0 });
    } catch (err) {
        console.error('Error en getStats:', err);
        res.status(500).json({ message: 'Error interno al obtener estadísticas' });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getStats,
    updateProfile,
    deleteUser,
    getAvatar
};
