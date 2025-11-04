import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:"light",
    user:null,
    token:null,
    posts:[],
    notifications:[],
};
export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode=state.mode==="light" ? "dark" : "light";
        },
        setLogin:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        setLogout:(state)=>{
            state.user=null;
            state.token=null;
        },
        setFriends:(state,action)=>{
            if(state.user){
                state.user.friends=action.payload.friends;
            }
            else {
                console.error("user friend is not exist");
            }
        },
        setPosts:(state,action)=>{
            state.posts=action.payload.posts;
        },
        setPost:(state,action)=>{
            const updatePosts=state.posts.map((post)=>{
                if(post._id===action.payload._id) return action.payload.post;
                return post;
            })
            state.posts=updatePosts;
        },
        setNotifications:(state,action)=>{
            state.notifications = action.payload.notifications;
        },
        addNotifications:(state,action)=>{
            state.notifications.unshift(action.payload.notification);
        },
        setNotificationsRead:(state,action)=>{
            state.notifications.forEach(n => n.isRead = true);
        }
    }
})
export const {setMode,setLogin,setLogout,setFriends,setPosts,setPost, setNotifications, addNotifications, setNotificationsRead}=authSlice.actions;
export default authSlice.reducer;