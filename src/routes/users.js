import express from "express";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const user = await UserModel.findOne({ $or: [{ username }, { email }] });

    // check if user already exists
    if (user) {
        if (user.username === username && user.email === email) {
            return res.status(400).json({ message: "Username and email already exist." });
        } else if (user.username === username) {
            return res.status(400).json({ message: "Username already exists." });
        } else if (user.email === email) {
            return res.status(400).json({ message: "Email already exists." });
        }
    };

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // register new user
    const newUser = new UserModel({
        username, email, password: hashedPassword 
    });
    await newUser.save();
    res.json({ message: "Welcome to BariCare!" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    // check if user exists
    if(!user) {
        return res.status(401).json({ message: "Email not found." });
    };

    // compare password typed with the one in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({ message: "Password is incorrect." });
    };

    // create token for sign in session
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, userID: user._id });
}); 

router.get("/:id/username", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error." });
    }
});

router.get("/:id/saved-recipes", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error." });
    }
});

export { router as userRouter }; 