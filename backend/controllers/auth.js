import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const SignUp=async(req,res)=>{
    try{
        let{firstName,lastName,email,password,picturePath,friends,location,occupation}=req.body;
        const salt=await bcrypt.genSalt();
        const hashedPassword=await bcrypt.hash(password,salt);
        if(picturePath==="")picturePath="Capture.PNG";
        const user=await User.findOne({email});
        if(user)return res.status(401).send("Email has existed");
        const newUser=new User({firstName,lastName,email,password:hashedPassword,picturePath,friends,location,occupation});
        await newUser.save();
        res.status(200).json(newUser);

    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const Login=async(req, res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user)return res.status(400).send("Wrong email or password");
        
        if(!bcrypt.compare(user.password,password))return res.status(400).send("Wrong email or password");
        //login successfully
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;
        return res.status(200).json({token,user});
    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}