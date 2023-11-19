const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    message: {
        type: String
    },
    timestamp: {
        type: Date
    },
    status: {
        type: String
    },
    data: {
        type: Object
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
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