import { Typography,Box } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTheme } from "@emotion/react";
import Friend from "../../components/Friend";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../states";
import { useEffect } from "react";
import API from "../../api";

const FriendListWidget = ({userId}) => {
    const dispatch=useDispatch();
    const {palette}=useTheme();
    const friends=useSelector((state)=>state.user.friends);

    const getFriends=async()=>{
        try {
            const response = await API.get(`/users/${userId}/friends`);
            dispatch(setFriends({friends: response.data}));
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        }
    }

    useEffect(()=>{
        getFriends();
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