const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Notification, notificationSchema } = require('../models/Notification.model');
const { Student, studentSchema } = require('../models/Student.model');

/* GET listing. */
router.get('/', protect, async (req, res, next) => {
    try {
        const notifications = await Notification.find({createdBy: req.user.id});
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:studentCode', async (req, res, next) => {
    try {
        const { studentCode } = req.params;
        const student = await Student.findOne({ studentCode });
        const notifications = await Notification.find({ recipients: student._id });
        notifications.map(notification => {
            notification.recipients = [student._id];
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* POST listing. */
router.post('/send', protect, async (req, res, next) => {
    try {
        const { recipients, sender, message, timestamp, status, data } = req.body;
        const sendedNotification = await Notification.create({
            recipients,
            sender,
            message,
            timestamp,
            status,
            data,
            createdBy: req.user.id,
            updatedBy: req.user.id
        });
        res.status(200).json(sendedNotification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* DELETE listing. */
router.delete('/:notificationId', protect, async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        req.status(200).json(deletedNotification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
