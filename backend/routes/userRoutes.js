import express from "express";
import {getUser, getUserFriends,addRemoveFriend, getUsers} from "../controllers/users.js";
import  verifyToken  from "../middlewares/auth.js";

const userRoute=express.Router();
userRoute.get("/:id",getUser);
userRoute.get("/:id/friends",verifyToken,getUserFriends);
userRoute.patch("/:id/:friendId",verifyToken,addRemoveFriend);
userRoute.post("/searchUsers",verifyToken,getUsers);
export default userRoute;

