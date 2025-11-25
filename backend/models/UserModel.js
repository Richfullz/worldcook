// backend/models/UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    roles: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
