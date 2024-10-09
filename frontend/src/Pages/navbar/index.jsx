import { useTheme } from "@emotion/react";
import FlexBetween from "../../components/FlexBetweens";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery,Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Close, DarkMode, Help, LightMode, Message, Notifications, Search,Menu } from "@mui/icons-material";
import { setLogout, setMode } from "../../states";
import { useEffect, useState } from "react";
import Friend from "../../components/Friend";

const NavBar = () => {
    const theme=useTheme();
    const alt=theme.palette.background.alt;
    const neutralLight=theme.palette.neutral.light;
    const dark=theme.palette.neutral.dark;
    const primaryLight=theme.palette.primary.light;
    const background=theme.palette.background.default;

    const user=useSelector((state)=>state.user);
    const fullName=`${user.firstName} ${user.lastName}`;
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const isNonMobile=useMediaQuery("(min-width:1000px)");
    const [isMobileToggled,setIsMobileToggled]=useState(false);

    //searching
    const [isSearch,setIsSearch]=useState(false);
    const [keyword,setKeyword]=useState("");
    const [searchUsers,setSearchUsers]=useState([])
    const token=useSelector((state)=>state.token);
    const handleSearch=async()=>{
        const res=await fetch("http://localhost:4000/users/searchUsers",{
            method: "POST",
            headers:{Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json"},
            body:JSON.stringify({keyword:keyword})
        })
        setSearchUsers(await res.json());
        setIsSearch(true);
        setKeyword("");
    }
    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography fontWeight="bold" fontSize="clamp(1rem,2rem,2.25rem)" color="primary" onClick={()=>navigate("/home")} sx={{ ":hover":{color:primaryLight,cursor:"pointer"}}}>SocialNetwork</Typography>
                {isNonMobile&&(
                    <Box>
                    <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                        <InputBase placeholder="Search for people you know" value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
                        <IconButton onClick={handleSearch}><Search/></IconButton>
                    </FlexBetween>
                        {isSearch&&(
                            searchUsers.length===0 ? (
                                <Typography>Can't find any user</Typography>
                            ):(
                                <Box sx={{position:"absolute",zIndex: 1000}} backgroundColor={alt}>
                                    {searchUsers.map((user)=>(
                                        <>
                                            <Friend sx={{py:"1rem"}}friendId={user._id} name={`${user.firstName} ${user.lastName}`} subtitle={user.location} userPicturePath={user.picturePath}/>
                                            <Divider/>
                                        </>
                                    ))}
                                </Box>
                            )
                        )}
                    </Box>
                )}
                {isNonMobile?(
                    <FlexBetween gap="2rem">
                        <IconButton onClick={()=>dispatch(setMode())}>
                            {theme.palette.mode==="dark"?(
                                <DarkMode sx={{fontSize:"25px"}}/>
                            ):(<LightMode sx={{color:dark,fontSize:"25px"}}/>)}
                        </IconButton>
                        <Message sx={{fontSize:"25px"}}/>
                        <Notifications sx={{fontSize:"25px"}}/>
                        <Help sx={{fontSize:"25px"}}/>
                        <FormControl variant="standard" value={fullName}>
                            <Select value={fullName} sx={{backgroundColor: neutralLight,width:"150px",borderRadius:"0.25rem", p:"0.25rem 1rem","& .MuiSelect-select:focus":{backgroundColor:neutralLight}}} input={<InputBase/>}>
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={()=>dispatch(setLogout())}>Log out</MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                ):(
                    <IconButton onClick={()=>setIsMobileToggled(!isMobileToggled)}><Menu/></IconButton>
                )}

                {!isNonMobile&&isMobileToggled&&(
                    <Box position="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="500px" minWidth="300px" backgroundColor={background}>
                        <Box display="flex" justifyContent="flex-end" p="1rem"><IconButton onClick={()=>setIsMobileToggled(!isMobileToggled)}><Close/></IconButton></Box>
                        <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
                            <IconButton onClick={()=>dispatch(setMode())}>{theme.palette.mode==="dark"?(
                                <DarkMode sx={{fontSize:"25px"}}/>
                            ):(<LightMode sx={{color:dark,fontSize:"25px"}}/>)}
                            </IconButton>
                            <Message sx={{fontSize:"25px"}}/>
                            <Notifications sx={{fontSize:"25px"}}/>
                            <Help sx={{fontSize:"25px"}}/>
                            <FormControl variant="standard" value={fullName}>
                                <Select value={fullName} sx={{backgroundColor:neutralLight,width:"150px",borderRadius:"0.25rem", p:"0.25rem 1rem","& .MuiSvgIcon-root":{pr:"0.25rem",width:"3rem"},"& .MuiSelect-select:focus":{backgroundColor:neutralLight}}} input={<InputBase />}>
                                    <MenuItem value={fullName}>
                                        <Typography>{fullName}</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={()=>dispatch(setLogout())}>Log out</MenuItem>
                                </Select>
                            </FormControl>
                        </FlexBetween>
                    </Box>
                )}
            </FlexBetween>
        </FlexBetween>
    )
}

export default NavBar;