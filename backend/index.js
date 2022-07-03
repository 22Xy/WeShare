import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();

// the extended: true precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// localhost:3001/posts
app.use("/posts", postRoutes);
// localhost:3001/user
app.use("/users", userRoutes);

// https://www.mongodb.com/cloud/atlas cloud mongodb
// this will be fixed/encrypted before deployment USING DOTENV
// const CONNECTION_URL = "";
// when deploying to heroku, process.env.PORT will be provided by heroku
// setting default port to 3001 instead of 5000 since Apple Airplay is listening port 5000
// https://developer.apple.com/forums/thread/682332
const PORT = process.env.PORT || 3002;

// https://stackoverflow.com/questions/55558402/what-is-the-meaning-of-bodyparser-urlencoded-extended-true-and-bodypar
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error));
