import {fileURLToPath} from "url";
import path from "path";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import { SignUp } from "./controllers/auth.js";
import verifyToken from "./middlewares/auth.js";
import { createPost } from "./controllers/post.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

//find Current directory
const __fileName=fileURLToPath(import.meta.url);
const __dirName=path.dirname(__fileName);

const config=dotenv.config();

//configuration server
const app=express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirName,"public/assets")));

//storage configuration
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload=multer({storage});
//file routes
app.post("/auth/register",upload.single("picture"),SignUp);
app.post("/posts",verifyToken,upload.single("picture"),createPost);

//routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

//connect to mongo and port 
const PORT=process.env.PORT || 4000
mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Connect to PORT ${PORT} and connect to mongoDB`);
    })
})
.catch((err)=>console.log(err.message));


