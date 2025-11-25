const mongoose = require('mongoose');
const { Schema } = mongoose;

const LikeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', LikeSchema);
