import {fileURLToPath} from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import { SignUp } from "./controllers/auth.js";
import verifyToken from "./middlewares/auth.js";
import { createPost } from "./controllers/post.js";
import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
app.use(cookieParser());
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
app.use("/auth",authRouter);
app.use("/users",userRoutes);
app.use("/posts",postRoutes(io, onlineUsers)); // Truyền io và onlineUsers vào router
app.use("/notifications",notificationRoutes);

// SOCKET.IO CONFIGURATION
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // URL của frontend
        methods: ["GET", "POST"],
    },
});

let onlineUsers = {};

const addUser = (userId, socketId) => {
    if (userId) onlineUsers[userId] = socketId;
};

const removeUser = (socketId) => {
    onlineUsers = Object.fromEntries(Object.entries(onlineUsers).filter(([, value]) => value !== socketId));
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lắng nghe sự kiện khi người dùng kết nối và gửi userId của họ
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        removeUser(socket.id);
    });
});

//connect to mongo and port 
const PORT=process.env.PORT || 4000
mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    server.listen(PORT,()=>{ // Sử dụng server.listen thay vì app.listen
        console.log(`Connect to PORT ${PORT} and connect to mongoDB`);
    })
})
.catch((err)=>console.log(err.message));
