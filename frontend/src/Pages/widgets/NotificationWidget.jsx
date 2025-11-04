import { Box, Typography, Divider, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { formatDistanceToNow } from 'date-fns';

const NotificationWidget = ({ notifications }) => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const getNotificationText = (type) => {
        switch (type) {
            case "like":
                return "liked your post.";
            case "comment":
                return "commented on your post.";
            default:
                return "sent you a notification.";
        }
    };

    return (
        <Box
            position="absolute"
            top="60px"
            right="20px"
            width="350px"
            maxHeight="400px"
            overflow="auto"
            backgroundColor={palette.background.alt}
            borderRadius="0.75rem"
            boxShadow={5}
            p="1rem"
            zIndex={10}
        >
            <Typography variant="h5" fontWeight="500" mb="1rem">Notifications</Typography>
            {notifications && notifications.length > 0 ? (
                notifications.map((notif) => (
                    <Box key={notif._id} sx={{ backgroundColor: !notif.isRead ? primaryLight : 'transparent', p: '0.5rem', borderRadius: '0.5rem', mb: '0.5rem' }}>
                        <FlexBetween gap="1rem">
                            <UserImage image={notif.sender.picturePath} size="40px" />
                            <Box flexGrow={1}>
                                <Typography variant="body2">
                                    <span style={{ fontWeight: 'bold' }}>{`${notif.sender.firstName} ${notif.sender.lastName}`}</span>
                                    {' '}{getNotificationText(notif.type)}
                                </Typography>
                                <Typography fontSize="0.75rem" color={medium}>
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </Box>
                ))
            ) : (
                <Typography>No new notifications.</Typography>
            )}
        </Box>
    );
};

export default NotificationWidget;

