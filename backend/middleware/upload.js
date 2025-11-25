// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = `uploads/${folderName}`;
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    return storage;
};

// Usuarios
const uploadUserAvatar = multer({ storage: createStorage('users') });

// Recetas (subcarpetas)
const recipeStorage = multer.diskStorage({
    destination(req, file, cb) {
        let folder = 'uploads/recipes';

        if (file.fieldname === 'imageCover') folder += '/cover';
        if (file.fieldname === 'images') folder += '/steps';

        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadRecipeImages = multer({
    storage: recipeStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Formato de imagen no permitido'));
        }
        cb(null, true);
    }
}).fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]);

module.exports = {
    uploadUserAvatar,
    uploadRecipeImages
};
