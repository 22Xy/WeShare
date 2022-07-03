import express from "express";
// remember to add .js extension (it can be ignored in react but not in node)
import {
  getPosts,
  getPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// localhost:3001/posts
router.get("/", getPosts);
router.get("/search", auth, getPostsBySearch);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
