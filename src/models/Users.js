import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    savedRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipes"
    }],
});

export const UserModel = mongoose.model("users", UserSchema);