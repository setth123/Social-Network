import express from "express";
import { getFeedPosts,getUserPosts,likePost,patchComment } from "../controllers/post.js";
import verifyToken from "../middlewares/auth.js";
import { getUsers } from "../controllers/users.js";

const postRouter=express.Router();
postRouter.get("/",verifyToken,getFeedPosts);
postRouter.get("/:userId/posts",verifyToken,getUserPosts);
postRouter.patch("/:id/like",verifyToken,likePost);
postRouter.patch("/:postId/comment",verifyToken,patchComment);

export default postRouter;

