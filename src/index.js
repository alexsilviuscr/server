import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

dotenv.config();

const app = express();
const mongoKey = process.env.MONGO_KEY;
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(mongoKey, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
app.listen(port);