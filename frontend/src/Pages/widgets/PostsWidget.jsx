import {useDispatch,useSelector} from "react-redux";

import PostWidget from "./PostWidget";
import {setPosts } from "../../states";
import { useEffect } from "react";

const PostsWidget = ({userId,isProfile=false}) => {
    const dispatch=useDispatch();
    const posts=useSelector((state)=>state.posts);
    const token=useSelector((state)=>state.token);
    const getPosts=async()=>{
        const res=await fetch("http://localhost:4000/posts",{
            method:"GET",
            headers:{Authorization:`Bearer ${token}`}
        });
        const data=await res.json();
        dispatch(setPosts({posts:data}));
    }
    
    const getUserPosts=async()=>{
        const res=await fetch(`http://localhost:4000/posts/${userId}/posts`,{
            method:"GET",
            headers:{Authorization:`Bearer ${token}`}
        })
        const data=await res.json();
        dispatch(setPosts({posts:data}));
    }
    
    useEffect(()=>{ 
        if(isProfile){
            getUserPosts();
        }
        else {
            getPosts();
        }
        
    },[]);
    
    return (
        <>
            {posts.map(({_id,
                        userId,
                        firstName,
                        lastName,
                        description,
                        location,
                        picturePath,
                        userPicturePath,
                        likes,
                        comments})=>(
                <PostWidget key={_id}
                            postId={_id} 
                            postUserId={userId} 
                            name={`${firstName} ${lastName}`} 
                            description={description} 
                            location={location} 
                            picturePath={picturePath} 
                            userPicturePath={userPicturePath} 
                            likes={likes} 
                            comments={comments}/>
            ))}
        </>
    )
}

export default PostsWidget;