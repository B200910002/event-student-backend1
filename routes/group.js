const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Group, groupSchema } = require('../models/Group.model');

/* GET listing. */
router.get('/', async (req, res, next) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:groupId', async (req, res, next) => {
    try {
        const { groupId } = req.params
        const group = await Group.findById(groupId);
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* POST listing. */
router.post('/', protect, async (req, res, next) => {
    try {
        const { name, description, students } = req.body;
        const group = await Group.create({
            name: name,
            description: description,
            students: students,
            createdBy: req.user.id,
            updatedBy: req.user.id
        });
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* PUT listing. */
router.put('/:groupId', protect, async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { name, description } = req.body;
        const group = await Group.findByIdAndUpdate(
            groupId,
            { name, description, updatedBy: req.user.id },
            { new: true }
        );
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* PATCH listing. */
router.patch('/:groupId/add-students', protect, async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { students } = req.body;

        const studentIds = students.map(student => student._id);

        const group = await Group.findByIdAndUpdate(
            groupId,
            { $addToSet: { students: { $each: studentIds } } },
            { new: true }
        );
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:groupId/remove-students', protect, async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { students } = req.body;

        const studentsRemove = students.map(student => student._id);

        const group = await Group.findByIdAndUpdate(
            groupId,
            { $pull: { students: { $in: studentsRemove } } },
            { new: true }
        );
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* DELETE listing. */
router.delete('/:groupId', protect, async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const deletedGroup = await Group.findByIdAndDelete(groupId);
        res.status(200).json(deletedGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
