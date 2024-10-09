
import {Box,Typography,useMediaQuery,useTheme} from "@mui/material"
import Form from "./form";
const AuthPage = () => {
    const theme=useTheme();
    const isNonMobileScreens=useMediaQuery("(min-width:1000px)");
    return (
        <Box>
            {/* title */}
            <Box width="100%" bgcolor={theme.palette.background.alt} p="1rem 6%">
                <Typography fontWeight="bold" fontSize="32px" color="primary">SocialApp</Typography>    
            </Box>
            <Box width={isNonMobileScreens ? "50%" : "93%"} p="2rem" m="2rem auto" borderRadius={"1.5 rem"} backgroundColor={theme.palette.background.alt}>
                <Typography fontWeight={"500"} variant="h5" sx={{mb:"1.5 rem"}}>Welcome to SocialApp, the social media for sociopaths</Typography>
            </Box>
            <Form />
        </Box>
    )
}

export default AuthPage;