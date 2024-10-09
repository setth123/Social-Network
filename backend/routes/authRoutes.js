import express from "express";
import {Login} from "../controllers/auth.js";

const authRoutes=express.Router();
authRoutes.post("/login",Login);
export default authRoutes;
