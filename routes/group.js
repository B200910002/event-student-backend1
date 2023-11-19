const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Group, groupSchema } = require('../models/Group.model');

/* GET listing. */
router.get('/', (req, res, next) => {
    Group.find().then(r => {
        res.status(200).json(r);
    }).catch(e => {
        res.status(400).json({ error: e.message });
    });
});

/* POST listing. */
router.post('/', protect, (req, res, next) => {
    const { name, description, students } = req.body;
    Group.create({
        name: name,
        description: description,
        students: students,
        createdBy: req.user.id,
        updatedBy: req.user.id
    }).then(group => {
        res.status(201).json(group);
    }).catch(error => {
        res.status(400).json({ error: e.message });
    });
});

/* POST listing. */
router.put('/:id', protect, (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    Group.findById(id).then(group => {
        group.name = name;
        group.description = description;
        group.save();
        res.status(202).json(group);
    }).catch(e => {
        res.status(400).json({ error: e.message });
    });
});

module.exports = router;
