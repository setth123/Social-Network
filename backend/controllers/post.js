import Post from "../models/Post.js";
import User from "../models/User.js";
export const createPost=async(req,res)=>{
    try{
        const{userId,description,picturePath}=req.body;
        const user=await User.findById(userId);
        const post=new Post({userId,firstName:user.firstName,lastName:user.lastName,location:user.location,description,userPicturePath:user.picturePath,picturePath,likes:{},comments:[]});
        await post.save();
        const posts=await Post.find();
        res.status(200).json(posts);

    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const getFeedPosts=async(req,res)=>{
    try{
        const post=await Post.find();
        res.status(200).json(post);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const getUserPosts=async(req,res)=>{
    try{
        const {userId}=req.params;
        
        const posts=await Post.find({userId});
        return res.status(200).json(posts);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const likePost=async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const post=await Post.findById(id);
        const isLiked=post.likes.get(userId);
        
        const user=await User.findById(userId);
        if(isLiked){
            post.likes.delete(userId);
            user.impressions= (user.impressions || 0) - 1;
        } 
        else {
            post.likes.set(userId,true);
            user.impressions= (user.impressions || 0) + 1;
        }
        await user.save();
        const updatePost=await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        );
        res.status(200).json(updatePost);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const patchComment=async(req,res)=>{
    try{
        const {postId}=req.params;
        const {userId,comment}=req.body;
        const post=await Post.findById(postId);
        const user=await User.findById(userId);
        post.comments.push({userName:`${user.firstName} ${user.lastName}`,comment:comment});
        await post.save();
        res.status(200).json(post.comments);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}