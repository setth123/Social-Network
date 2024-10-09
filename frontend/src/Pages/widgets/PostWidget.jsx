import { IconButton,useTheme,Typography, Box, Divider, TextField, InputBase } from '@mui/material';
import WidgetWrapper from '../../components/WidgetWrapper'
import {FavoriteOutlined,ChatBubbleOutlineOutlined,ShareOutlined,SendOutlined} from '@mui/icons-material'
import {useState} from "react"
import {useDispatch,useSelector} from "react-redux"
import FlexBetween from '../../components/FlexBetweens';
import Friend from '../../components/Friend'; 
import { setPost } from '../../states';

const PostWidget = ({postId,postUserId,name,description,location,picturePath,userPicturePath,likes,comments}) => {
    const [isComment,setIsComment]=useState(false);
    const [comment,setComment]=useState("");
    const [curComments,setCurComments]=useState(comments);

    const dispatch=useDispatch();
    const token=useSelector((state)=>state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const [isLiked,setIsLiked] = useState(Boolean(likes[loggedInUserId]));
    const [likeCount,setLikeCount]=useState(Object.keys(likes).length);
    const {palette}=useTheme();
    const main=palette.neutral.main;
    const primary=palette.primary.main;
    const isMyPost=(loggedInUserId===postUserId);
    

    const patchLike=async()=>{
        const res= await fetch(`http://localhost:4000/posts/${postId}/like`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({userId:loggedInUserId}),
        });
        const updatePost=await res.json();
        dispatch(setPost({post:updatePost}));
        setIsLiked(!isLiked);
        setLikeCount(Object.keys(updatePost.likes).length);
    }

    const handleComment=async()=>{
        const res=await fetch(`http://localhost:4000/posts/${postId}/comment`,{
            method:'PATCH',
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({userId:loggedInUserId,comment:comment}),
        });
        setComment("");
        const updateComments=await res.json();
        setCurComments(updateComments);
    }

    return (
        <WidgetWrapper m="2rem 0">
            <Friend friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} isMyPost={isMyPost}/>
            <Typography color={main} sx={{mt:"1rem"}}>{description}</Typography>
            {picturePath&&(
                <img width="100%" height="auto" alt="post" style={{borderRadius:"0.75rem",marginTop:"0.75rem"}} src={`http://localhost:4000/assets/${picturePath}`}/>
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked?(
                                <FavoriteOutlined sx={{color:primary}}/>
                            ):(
                                <FavoriteOutlined/>
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={()=>setIsComment(!isComment)}>
                            <ChatBubbleOutlineOutlined/>
                        </IconButton>
                        <Typography>{curComments.length}</Typography>
                    </FlexBetween>

                </FlexBetween>
            </FlexBetween>
                {isComment &&(
                    <Box mt="0.5rem">
                        <FlexBetween sx={{mb:"0.5rem"}}>
                            <InputBase onChange={(e)=>setComment(e.target.value)} value={comment} sx={{width:"80%",backgroundColor:palette.neutral.light,borderRadius:"2rem",padding:"0.1rem 1rem"}}/>
                            <IconButton onClick={handleComment} sx={{mr:"3rem"}}><SendOutlined/></IconButton>
                        </FlexBetween>
                        {curComments.map(({userName,comment},i)=>(
                            <Box key={`${name}-${i}`}>
                                <Divider/>
                                <Box>
                                <Typography sx={{color:primary,m:"0.1rem 0",pl:"1rem"}}>{userName}</Typography>
                                <Typography sx={{color:main,m:"0.5rem 0",pl:"1rem"}}>
                                    {comment}
                                </Typography>
                                </Box>
                            </Box>
                        ))}
                        <Divider/>
                    </Box>
                )}
        </WidgetWrapper>
    )
}

export default PostWidget;