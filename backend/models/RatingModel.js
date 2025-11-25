const mongoose = require('mongoose');
const { Schema } = mongoose;

const RatingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);
