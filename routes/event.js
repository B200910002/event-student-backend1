const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Event, eventSchema } = require('../models/Event.model');

/* GET listing. */
router.get('/', protect, async (req, res, next) => {
    try {
        const events = await Event.find({ createdBy: req.user.id });
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/:eventId', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findOne({ _id: eventId, createdBy: req.user.id });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

/* POST listing. */
router.post('/', protect, async (req, res, next) => {
    try {
        const { name, description, startAt, endAt, place, students, groups } = req.body;
        const event = await Event.create({
            name: name,
            description: description,
            startAt: startAt,
            endAt: endAt,
            place: place,
            students: students,
            groups: groups,
            createdBy: req.user.id,
            updatedBy: req.user.id
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* PUT listing. */
router.put('/:eventId', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { name, description, startAt, endAt, place } = req.body;
        const event = await Event.findByIdAndUpdate(
            eventId,
            { name, description, startAt, endAt, place, updatedBy: req.user.id },
            { new: true }
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* PATCH listing. */
router.patch('/:eventId/add-students', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { students } = req.body;

        const studentIds = students.map(student => student._id);

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { students: { $each: studentIds } } },
            { new: true }
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:eventId/remove-students', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { students } = req.body;

        const studentsRemove = students.map(student => student._id);

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $pull: { students: { $in: studentsRemove } } },
            { new: true }
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:eventId/add-groups', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { groups } = req.body;

        const groupIds = groups.map(group => group._id);

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { groups: { $each: groupIds } } },
            { new: true }
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:eventId/remove-groups', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { groups } = req.body;

        const groupsRemove = groups.map(group => group._id);

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $pull: { groups: { $in: groupsRemove } } },
            { new: true }
        );
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* DELETE listing. */
router.delete('/:eventId', protect, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        res.status(200).json(deletedEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
