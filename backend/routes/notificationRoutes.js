import express from "express";
import { getNotifications, markNotificationsAsRead } from "../controllers/notificationController.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// Tất cả các route ở đây đều cần xác thực
router.use(verifyToken);

router.get("/", getNotifications);
router.patch("/read", markNotificationsAsRead);

export default router;

