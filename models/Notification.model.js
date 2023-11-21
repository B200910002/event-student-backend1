const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    },
    status: {
        type: String,
        default: "UNREAD",
        required: true
    },
    data: {
        type: Object,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = {
    Notification: mongoose.model("Notification", notificationSchema),
    notificationSchema
}