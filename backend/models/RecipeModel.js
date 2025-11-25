const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
    title: { type: String, required: true },
    description: String,

    ingredients: [String],
    steps: [String],

    imageCover: String,
    images: [String],

    category: String,
    diet: [String],
    allergens: [String],

    prepTime: Number,
    cookTime: Number,
    totalTime: Number,

    servings: Number,

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            text: String,
            date: { type: Date, default: Date.now }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
