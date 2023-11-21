const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { Student, studentSchema } = require('../models/Student.model')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/:studentId', async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
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
