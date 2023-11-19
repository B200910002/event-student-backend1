const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Notification, notificationSchema } = require('../models/Notification.model');

/* GET listing. */
router.get('/', async (req, res, next) => {
    const notifications = await Notification.find();
    res.send(notifications);
});

module.exports = router;
