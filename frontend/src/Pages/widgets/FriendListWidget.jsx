import { Typography,Box } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTheme } from "@emotion/react";
import Friend from "../../components/Friend";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../states";
import { useEffect, useState } from "react";

const FriendListWidget = ({userId}) => {
    const dispatch=useDispatch();
    const {palette}=useTheme();
    const token=useSelector((state)=>state.token);
    const friends=useSelector((state)=>state.user.friends);
    //const [friends,setFriends]=useState([]);
    const getFriends=async()=>{
        const res=await fetch(`http://localhost:4000/users/${userId}/friends`,{
            method: 'GET',
            headers:{Authorization:`Bearer ${token}`},
        })
        const data=await res.json();
        //setFriends(data);
        dispatch(setFriends({friends:data}));
    }
    useEffect(()=>{
        getFriends();
        //console.log(friends[0].lastName);
    },[]); // eslint-disable-line react-hooks/exhaustive-dep
    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{mb:"1.5rem"}}>Friend List</Typography>
            <Box>
                {friends.map((friend)=>(
                    <Friend 
                    key={friend._id} 
                    friendId={friend._id} 
                    name={`${friend.firstName} ${friend.lastName}`} 
                    subtitle={friend.occupation} 
                    userPicturePath={friend.picturePath}/>
                ))}
            </Box>
        </WidgetWrapper>
    )
}

export default FriendListWidget;