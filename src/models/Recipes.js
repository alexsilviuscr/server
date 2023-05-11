import mongoose from 'mongoose';
import slugify from 'slugify';

const RecipesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
});

RecipesSchema.pre('save', function (next) {
  this.slug = `${slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g })}-${this._id}`;
  next();
});

export const RecipeModel = mongoose.model("recipes", RecipesSchema);
