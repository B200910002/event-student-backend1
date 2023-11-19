const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Event, eventSchema } = require('../models/Event.model');

/* GET listing. */
router.get('/', async (req, res, next) => {
    const events = await Event.find();
    res.send(events);
});

module.exports = router;
