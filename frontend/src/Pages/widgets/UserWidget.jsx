import WidgetWrapper from '../../components/WidgetWrapper'
import FlexBetween from '../../components/FlexBetweens'
import UserImage from '../../components/UserImage'
import {useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react';
import { Box, Divider, Typography,useTheme } from '@mui/material';
import {ManageAccountsOutlined,LocationOnOutlined,WorkOutlineOutlined, EditOutlined} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const UserWidget = ({userId,picturePath}) => {
    const [user,setUser]=useState(null);
    const navigate=useNavigate();
    const {palette}=useTheme();
    
    const getUser=async() =>{
        const res=await fetch(`http://localhost:4000/users/${userId}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        const user=await res.json();
        setUser(user);
    }
    useEffect(()=>{getUser()},[]);
    if(!user)return null;

    const {firstName,lastName,location,occupation,impressions,friends}=user;

    const dark=palette.neutral.dark;
    const medium=palette.neutral.medium;
    const main=palette.neutral.main;
    return (
        <WidgetWrapper>
            {/* first row */}
            <FlexBetween gap="0.5rem" pb="1.1rem" onClick={()=>{navigate(`/profile/${userId}`)}}>
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath}/>
                    <Box>
                        <Typography variant="h4" color={dark} fontWeight="500" sx={{":hover":{color:palette.primary.light,cursor:"pointer"}}}>
                            {firstName} {lastName}
                        </Typography>
                        <Typography color={medium}>{friends.length} friends</Typography>
                    </Box>
                </FlexBetween>
                <ManageAccountsOutlined />
            </FlexBetween>

            <Divider />
            {/* second row */}
            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <LocationOnOutlined fontSize="large" sx={{color:main}}/> 
                    <Typography color={medium}>{location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <WorkOutlineOutlined fontSize="large" sx={{color:main}}/>
                    <Typography color={medium}>{occupation}</Typography>
                </Box>
            </Box>

            <Divider/>
            {/* third row */}
            <Box p="1rem 0">
                <FlexBetween>
                    <Typography color={medium}>Impressions of your posts</Typography>
                    <Typography color={main} fontWeight="500">{impressions}</Typography>
                </FlexBetween>
            </Box>

            <Divider/>
            {/* fourth row */}
            <Box p="1rem 0">
                <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                    Social Profile
                </Typography>

                <FlexBetween gap="1rem" mb="0.5rem">
                    <FlexBetween gap="1rem">
                        <XIcon/>
                        <Box>
                            <Typography color={main} fontWeight="500">X</Typography>
                            <Typography color={medium}>Social Network</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{color:main}}/>
                </FlexBetween>

                <FlexBetween gap="1rem" mb="0.5rem">
                    <FlexBetween gap="1rem">
                        <LinkedInIcon/>
                        <Box>
                            <Typography color={main} fontWeight="500">Linkedin</Typography>
                            <Typography color={medium}>Network PLatform</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{color:main}}/>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    )
}

export default UserWidget;