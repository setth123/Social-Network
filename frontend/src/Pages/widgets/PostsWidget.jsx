import {useDispatch,useSelector} from "react-redux";
import PostWidget from "./PostWidget";
import { setPosts } from "../../states";
import { useEffect, useCallback, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../../api"; // Import API client

const PostsWidget = ({userId,isProfile=false}) => {
    const dispatch=useDispatch();
    const posts=useSelector((state)=>state.posts);
    const token=useSelector((state)=>state.token);
    const loggedInUserId = useSelector((state) => state.user?._id);
    const socket = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (url, append = false) => {
        const res = await API.get(url);
        const data = res.data;
        if (append) {
            dispatch(setPosts({ posts: [...posts, ...data] }));
        } else {
            dispatch(setPosts({ posts: data }));
        }

        // end of posts list
        if (data.length < 10) {
            setHasMore(false);
        }

        setIsLoading(false);
    }, [token, dispatch, posts]);

    const getPosts = useCallback(() => {
        setHasMore(true); // Reset khi tải lại từ đầu
        fetchPosts("http://localhost:4000/posts");
    }, [fetchPosts]);

    const getUserPosts = useCallback(() => {
        // API getUserPosts (not support pagination)
        setHasMore(false); 
        fetchPosts(`http://localhost:4000/posts/${userId}/posts`);
    }, [fetchPosts, userId]);

    useEffect(()=>{
        if(isProfile){
            getUserPosts();
        }
        else {
            getPosts();
        }
    },[isProfile, userId]); 

    const loadMorePosts = useCallback(() => {
        if (isLoading || !hasMore || isProfile || posts.length === 0) return;

        setIsLoading(true);

        // get cursor
        const lastPost = posts[posts.length - 1];
        const cursor = lastPost.createdAt;

        // Call api
        const url = `http://localhost:4000/posts?cursor=${encodeURIComponent(cursor)}`;
        fetchPosts(url, true); // `true` để nối vào danh sách hiện tại
    }, [isLoading, hasMore, isProfile, posts, fetchPosts]);

    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled to the bottom
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                loadMorePosts();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener khi component unmount
    }, [loadMorePosts]);

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
            {/* Loading... */}
            {isLoading && (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading more posts...</p>
            )}
        </>
    )
}

export default PostsWidget;