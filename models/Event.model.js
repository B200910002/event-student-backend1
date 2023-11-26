const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    startAt: {
        type: Date
    },
    endAt: {
        type: Date
    },
    place: {
        type: String
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
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
    Event: mongoose.model("Event", eventSchema),
    eventSchema
}