import mongoose from 'mongoose';

const RecipesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    slug: { type: String },
    imageUrl: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    cookingTime: { type: Number, required: true },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

export const RecipeModel = mongoose.model("recipes", RecipesSchema);