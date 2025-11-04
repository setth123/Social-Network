import User from "../models/User.js";
import redisClient from "../redisClient.js";

export const getUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id);
        user.viewedProfile = (user.viewedProfile || 0) + 1;
        await user.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(404).json(err.message);
    }
}

export const getUsers=async(req,res)=>{
    try{
        const {keyword}=req.body;
        const regex=new RegExp(keyword,"i");
        const users=await User.aggregate([
            {
                $addFields:{
                    fullName:{$concat:["$firstName"," ","$lastName"]}
                }
            },
            {
                $match:{
                    fullName:{$regex:regex}
                }
            }
        ])
        res.status(200).json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err.message);
    }
}

export const getUserFriends=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id);

        // Tối ưu hóa: Chỉ một truy vấn để lấy tất cả bạn bè
        const friends = await User.find({ _id: { $in: user.friends } });

        const formattedFriends=friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
            return {_id,firstName,lastName,occupation,location,picturePath};
        });
        res.status(200).json(formattedFriends);
    }catch(err){
        console.log(err);
        res.status(500).json(err.message);
    }
}

export const addRemoveFriend=async (req,res)=>{
    try{
        console.log("called");
        const {id,friendId}=req.params;
        const user=await User.findById(id);
        const friend=await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id!==friendId);
            friend.friends=friend.friends.filter((currentId)=>currentId!==id); // Sửa lỗi logic
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        // Cache Invalidation
        await redisClient.del(`feed:${id}`);
        await redisClient.del(`feed:${friendId}`);


        // Lấy lại danh sách bạn bè đầy đủ thông tin để trả về
        const friends = await User.find({ _id: { $in: user.friends } });

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id,firstName,lastName,occupation,location,picturePath};
            }
        );

        res.status(200).json(formattedFriends);
    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}