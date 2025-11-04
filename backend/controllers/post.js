import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import redisClient from "../redisClient.js";
export const createPost=async(req,res)=>{
    try{
        const{userId,description,picturePath}=req.body;
        const user=await User.findById(userId);
        const post=new Post({userId,firstName:user.firstName,lastName:user.lastName,location:user.location,description,userPicturePath:user.picturePath,picturePath,likes:{},comments:[]});
        await post.save(); 

        // Cache Invalidation
        const cacheKey = `feed:${userId}`;
        await redisClient.del(cacheKey);

        res.status(201).json(post); // Chỉ trả về bài post vừa tạo

    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const getFeedPosts=async(req,res)=>{
    try {
        const { cursor } = req.query; // get current cursor (ex:/posts?cursor=2023-10-27T10:00:00.000Z) )
        const limit = 10; // Số lượng bài viết mỗi lần tải
        const currentUserId = req.user.id;
        const cacheKey = `feed:${currentUserId}`;

        // --- LOGIC CACHING ---
        // Chỉ áp dụng cache cho trang đầu tiên (khi không có cursor)
        if (!cursor) {
            const cachedPosts = await redisClient.get(cacheKey);
            if (cachedPosts) {
                // Cache Hit: Trả về dữ liệu từ Redis
                return res.status(200).json(JSON.parse(cachedPosts));
            }
        }

        // Cache Miss (next page)
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const userIds = [...currentUser.friends, currentUser._id];

        const query = { userId: { $in: userIds } };
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const posts = await Post.find(query).sort({ createdAt: -1 }).limit(limit);

        // set cache
        if (!cursor && posts.length > 0) {
            await redisClient.setEx(cacheKey, 300, JSON.stringify(posts)); // 300 giây = 5 phút
        }

        res.status(200).json(posts);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const getUserPosts=async(req,res)=>{
    try{
        const {userId}=req.params;
        
        const posts=redisClient.get(`posts:${userId}`);
        if(posts){ 
            return res.status(200).json(posts);
        }
        const userPosts=await Post.find({userId});
        res.status(200).json(userPosts);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const likePost=async(req,res, io, onlineUsers)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        const post=await Post.findById(id);
        const isLiked=post.likes.get(userId);

        const liker = await User.findById(userId);
        const postOwnerId = post.userId;
        
        if(isLiked){
            post.likes.delete(userId);
        } 
        else {
            post.likes.set(userId,true);
        }

        // Gửi thông báo nếu người like không phải chủ bài viết
        if (userId !== postOwnerId) {
            // 1. Lưu thông báo vào DB
            const newNotification = new Notification({
                recipient: postOwnerId,
                sender: userId,
                type: "like",
            });
            await newNotification.save();

            // 2. Gửi thông báo real-time qua socket
            const receiverSocketId = onlineUsers[postOwnerId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", {
                    senderName: `${liker.firstName} ${liker.lastName}`,
                    type: "like",
                    notification: newNotification // Gửi kèm cả object notification
                });
            }
        }

        const updatedPost=await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        );

        res.status(200).json(updatedPost);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const patchComment=async(req,res, io, onlineUsers)=>{
    try{
        const {postId}=req.params;
        const {userId,comment}=req.body;
        const user=await User.findById(userId);
        const newComment = {userId, userName:`${user.firstName} ${user.lastName}`,comment:comment, userPicturePath: user.picturePath};

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment } },
            { new: true }
        );

        // Gửi thông báo nếu người comment không phải chủ bài viết
        if (userId !== updatedPost.userId) {
            // 1. Lưu thông báo vào DB
            const newNotification = new Notification({
                recipient: updatedPost.userId,
                sender: userId,
                type: "comment",
            });
            await newNotification.save();

            // 2. Gửi thông báo real-time qua socket
            const receiverSocketId = onlineUsers[updatedPost.userId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", {
                    senderName: newComment.userName,
                    type: "comment",
                    notification: newNotification // Gửi kèm cả object notification
                });
            }
        }

        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updatedPost);
    }
    catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }

}
