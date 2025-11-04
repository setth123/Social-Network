import express from "express";
import { Login, refreshToken, logout } from "../controllers/auth.js";

const authRoutes=express.Router();
authRoutes.post("/login",Login);
authRoutes.get("/refresh", refreshToken);
authRoutes.post("/logout", logout);

export default authRoutes;
