const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Student, studentSchema } = require('../models/Student.model')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    const students = await Student.find();
    res.send(students);
});

/* POST users listing. */
router.post('/import', protect, async (req, res, next) => {
    try {
        const students = req.body;
        students.map(async student => {
            await Student.create({
                studentCode: student.s_code,
                firstName: student.fname,
                lastName: student.lname,
                email: student.email,
                phone: student.phone,
                password: student.password
            });
        });
        res.status(201).json("Students import successfully");
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});

/* DELETE users listing. */
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndDelete(id);
        res.status(201).json("Students delete successfully");
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});

module.exports = router;
