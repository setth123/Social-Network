import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../redisClient.js";

export const SignUp=async(req,res)=>{
    try{
        let{firstName,lastName,email,password,picturePath,friends,location,occupation}=req.body;
        const salt=await bcrypt.genSalt();
        const hashedPassword=await bcrypt.hash(password,salt);
        if(picturePath==="")picturePath="Capture.PNG";
        const user=await User.findOne({email});
        if(user)return res.status(401).send("Email has existed");
        const newUser=new User({firstName,lastName,email,password:hashedPassword,picturePath,friends,location,occupation, viewedProfile: 0, impressions: 0});
        const savedUser = await newUser.save();
        savedUser.password = undefined; 
        res.status(201).json(savedUser); 

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

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)return res.status(400).send("Wrong email or password");

        // Tạo Access Token (ngắn hạn)
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Ví dụ: 15 phút
        );

        // Tạo Refresh Token (dài hạn)
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' } // Ví dụ: 7 ngày
        );

        // Lưu refresh token vào Redis thay vì DB. Key là userId, value là token.
        // Thời gian hết hạn của key trong Redis bằng thời gian hết hạn của token.
        await redisClient.set(user._id.toString(), refreshToken, {
            EX: 7 * 24 * 60 * 60 // 7 ngày tính bằng giây
        });

        // Gửi refresh token qua httpOnly cookie để bảo mật
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // Ngăn JavaScript phía client truy cập
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        user.password = undefined; // Xóa password khỏi đối tượng trước khi gửi đi
        return res.status(200).json({ token: accessToken, user });
    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

export const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;

    // Kiểm tra xem token có trong blacklist không
    const isBlacklisted = await redisClient.sIsMember('blacklist', refreshToken);
    if (isBlacklisted) return res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        // Kiểm tra xem token trong Redis có khớp với token được gửi lên không
        const storedToken = await redisClient.get(decoded.id);
        if (!storedToken || storedToken !== refreshToken) return res.sendStatus(403);

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.json({ token: accessToken });
    });
};

export const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Thêm token vào blacklist trong Redis. Sử dụng Set để hiệu quả.
    await redisClient.sAdd('blacklist', refreshToken);

    // Tìm userId từ token để xóa key trong Redis
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (decoded?.id) {
            await redisClient.del(decoded.id);
        }
    });

    // Xóa cookie ở phía client
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
    res.sendStatus(204); // No content
};