import Notification from "../models/Notification.js";

/**
 * @desc    Lấy danh sách thông báo cho người dùng đã đăng nhập
 * @route   GET /notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id, isRead: false})
            .populate("sender", "firstName lastName picturePath") // Lấy thêm thông tin người gửi
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @desc    Đánh dấu tất cả thông báo chưa đọc thành đã đọc
 * @route   PATCH /notifications/read
 * @access  Private
 */
export const markNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, isRead: false }, { $set: { isRead: true } });
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

