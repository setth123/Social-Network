import { Typography } from "@mui/material"
import FlexBetween from "../../components/FlexBetweens"
import WidgetWrapper from "../../components/WidgetWrapper"
import { useTheme } from "@emotion/react"

const AdvertWidget = () => {
    const {palette}=useTheme();
    const dark=palette.neutral.dark;
    const main=palette.neutral.main;
    const medium=palette.neutral.medium;
    return (
        <WidgetWrapper>
            <FlexBetween >
                <Typography color={dark} variant="h5" fontWeight="500">Sponsored</Typography>
                <Typography color={medium}>Create Ad</Typography>
            </FlexBetween>
            <img width="100%" height="auto" alt="advert" src="http://localhost:4000/assets/Capture.PNG" style={{borderRadius:"0.75rem",margin:"0.75rem 0"}}/>
            <FlexBetween>
                <Typography color={main}>Brands</Typography>
                <Typography color={medium}>Brands websites</Typography>
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">Brand motto</Typography>
        </WidgetWrapper>
    )
}

export default AdvertWidget