import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: { // Người nhận thông báo
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: { // Người gửi (người thực hiện hành động)
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: { // Loại thông báo: 'like', 'comment', 'friend_request', etc.
            type: String,
            enum: ["like", "comment"],
            required: true,
        },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
