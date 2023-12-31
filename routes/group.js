const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Group, groupSchema } = require('../models/Group.model');
const { University, universitySchema } = require('../models/University.model');
const { User, userSchema } = require('../models/User.model');

/* GET listing. */
router.get('/', protect, async (req, res, next) => {
    try {
        const groups = await Group.find({ createdBy: req.user.id });
        const responseGroups = [];
        for(const group of groups) {
            const gr = {};
            const university = await University.findById(group.university);
            const createdBy = await User.findById(group.createdBy);
            const updatedBy = await User.findById(group.updatedBy);

            gr._id = group._id;
            gr.name = group.name;
            gr.description = group.description;
            gr.students = group.students;
            gr.university = university?.name;
            gr.createdBy = createdBy?.firstName;
            gr.updatedBy = updatedBy?.firstName;
            gr.createdAt = group.createdAt;
            gr.updatedAt = group.updatedAt;
            gr.__v = group.__v;

            responseGroups.push(gr);
        };
        res.status(200).json(responseGroups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:groupId', protect, async (req, res, next) => {
    try {
        const { groupId } = req.params
        const group = await Group.findOne({ _id: groupId, createdBy: req.user.id });
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* POST listing. */
router.post('/', protect, async (req, res, next) => {
    try {
        const { name, description, students, university } = req.body;
        const group = await Group.create({
            name: name,
            description: description,
            students: students,
            university: university,
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
        const { name, description, university } = req.body;
        const group = await Group.findByIdAndUpdate(
            groupId,
            { name, description, university, updatedBy: req.user.id },
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
