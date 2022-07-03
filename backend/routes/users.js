import express from "express";
// remember to add .js extension (it can be ignored in react but not in node)
import { signin, signup } from "../controllers/users.js";

const router = express.Router();

// localhost:3001/users
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
