import express from "express";
import { getFeedPosts,getUserPosts,likePost,patchComment } from "../controllers/post.js";
import verifyToken from "../middlewares/auth.js";

const createPostRouter = (io, onlineUsers) => {
    const postRouter=express.Router();

    // Định nghĩa các hàm controller với io và onlineUsers được truyền vào
    const likePostHandler = (req, res) => likePost(req, res, io, onlineUsers);
    const patchCommentHandler = (req, res) => patchComment(req, res, io, onlineUsers);

    postRouter.get("/",verifyToken,getFeedPosts);
    postRouter.get("/:userId/posts",verifyToken,getUserPosts);
    postRouter.patch("/:id/like",verifyToken,likePostHandler);
    postRouter.patch("/:postId/comment",verifyToken,patchCommentHandler);

    return postRouter;
};

export default createPostRouter;
