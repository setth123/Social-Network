import { useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Badge,
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setNotifications, addNotifications, setNotificationsRead } from "../../states";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import NotificationWidget from "../widgets/NotificationWidget";
import API from "../../api/index.js";
import { io } from "socket.io-client";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const notifications = useSelector((state) => state.notifications);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const socket = useRef();

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = user ? `${user.firstName} ${user.lastName}` : "";
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fetch initial notifications
    useEffect(() => {
        const getNotifications = async () => {
            try {
                const response = await API.get("/notifications");
                dispatch(setNotifications({ notifications: response.data }));
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        if (user) {
            getNotifications();
        }
    }, [user, dispatch]);

    // Socket.IO listener
    useEffect(() => {
        if (!user) return;

        socket.current = io("ws://localhost:4000");
        socket.current.emit("addUser", user._id);

        socket.current.on("getNotification", (data) => {
            // Thêm thông báo mới vào Redux state
            dispatch(addNotifications({ notification: data.notification }));
        });

        return () => socket.current.disconnect();
    }, [user, dispatch]);

    const handleNotificationToggle = async () => {
        setIsNotificationOpen(!isNotificationOpen);
        // Nếu mở và có thông báo chưa đọc -> đánh dấu đã đọc
        if (!isNotificationOpen && unreadCount > 0) {
            try {
                await API.patch("/notifications/read");
                dispatch(setNotificationsRead());
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        }
    };

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{ "&:hover": { color: primaryLight, cursor: "pointer" } }}
                >
                    Sociopedia
                </Typography>
                {isNonMobileScreens && (
                    <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                        <InputBase placeholder="Search..." />
                        <IconButton><Search /></IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
                    </IconButton>
                    <Message sx={{ fontSize: "25px" }} />
                    <IconButton onClick={handleNotificationToggle}>
                        <Badge badgeContent={unreadCount} color="error">
                            <Notifications sx={{ fontSize: "25px" }} />
                        </Badge>
                    </IconButton>
                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName}
                            sx={{ backgroundColor: neutralLight, width: "150px", borderRadius: "0.25rem", p: "0.25rem 1rem", "& .MuiSvgIcon-root": { pr: "0.25rem", width: "3rem" }, "& .MuiSelect-select:focus": { backgroundColor: neutralLight } }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}><Typography>{fullName}</Typography></MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                        </Select>
                    </FormControl>
                    {isNotificationOpen && <NotificationWidget notifications={notifications} />}
                </FlexBetween>
            ) : (
                // ... Mobile Nav (giữ nguyên nếu có)
                <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}><Menu /></IconButton>
            )}
        </FlexBetween>
    );
};

export default Navbar;
