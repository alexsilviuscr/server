import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// get all recipes
router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Couldn't get recipes." });
  }
});

// create a new recipe
router.post("/", async (req, res) => {
  const recipe = new RecipeModel(req.body);
  
  try {
    const response = await recipe.save();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Couldn't create recipe." });
    }
});

//get recipe by id
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipeModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// save recipe
router.put("/", async (req, res) => {

  try {
    const recipe = await RecipeModel.findById(req.body.recipeId);
    const user = await UserModel.findById(req.body.userId);

    user.savedRecipes.push(recipe);
    await user.save();

    res.status(201).json ({ savedRecipes: user.savedRecipes });

  } catch (error) {
    res.status(500).json({ message: "Couldn't save recipe." });
  }
});

// save recipe by id
router.put("/:recipeId", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.recipeId);
    const user = await UserModel.findById(req.body.userId);

    user.savedRecipes.push(recipe);
    await user.save();

    res.status(201).json ({ savedRecipes: user.savedRecipes });

  } catch (error) {
    res.status(500).json({ message: "Couldn't save recipe." });
  }
});

// get IDs of saved recipes
router.get("/saved-recipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json( { savedRecipes: user?.savedRecipes } );
  } catch (error) {
    res.status(500).json({ message: "Couldn't get saved recipes IDs." });
  }
});

// get the list of user saved recipes
router.get("/saved-recipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipeModel.find({
        _id: { $in: user.savedRecipes }
    });

    res.status(201).json( { savedRecipes } );
  } catch (error) {
    res.status(500).json({ message: "Couldn't get saved recipes." });
  }
});

// delete recipe by id - WORKS!
// router.delete("/:recipeId", async (req, res) => {
//   try {
//     const result = await RecipeModel.findByIdAndDelete(req.params.recipeId);
//     if (!result) {
//         res.status(404).json({ message: "Recipe not found." });
//         console.log("Recipe not found");
//     } else {
//         res.status(200).json({ message: "Recipe deleted." });
//         console.log("Recipe deleted");
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Couldn't delete recipe." });
//   }
// });

// delete a recipe from the savedRecipes array
router.delete("/saved-recipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
    } else {
      await UserModel.updateOne({ _id: user._id }, { $pull: { savedRecipes: req.body.recipeId } });
      res.status(200).json({ message: "Recipe deleted." });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't delete recipe." });
  }
});

export { router as recipesRouter };