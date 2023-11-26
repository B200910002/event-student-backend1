const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/middleware');
const { University, universitySchema } = require('../models/University.model');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
        const universities = await University.find();
        res.status(200).json(universities);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/:universityId', protect, async (req, res, next) => {
    try {
        const { universityId } = req.params;
        const university = await University.findById(universityId);
        res.status(200).json(university);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

/* POST users listing. */
router.post('/', protect, isAdmin, async (req, res, next) => {
    try {
        const { name, abbreviatedName } = req.body;
        const university = await University.create({ name, abbreviatedName });
        res.status(200).json(university);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

/* PUT users listing. */
router.put('/:universityId', protect, isAdmin, async (req, res, next) => {
    try {
        const { universityId } = req.params;
        const { name, abbreviatedName } = req.body;
        const university = await University.findByIdAndUpdate(
            universityId,
            { name, abbreviatedName },
            { new: true }
        );
        res.status(200).json(university);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

/* PATCH users listing. */
router.patch('/:universityId', protect, isAdmin, async (req, res, next) => {
    try {
        const { universityId } = req.params;
        const { name, abbreviatedName } = req.body;
        const university = await University.findByIdAndUpdate(
            universityId,
            { name, abbreviatedName },
            { new: true }
        );
        res.status(200).json(university);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

/* DELETE users listing. */
router.delete('/:universityId', protect, isAdmin, async (req, res, next) => {
    try {
        const { universityId } = req.params;
        const university = await University.findByIdAndDelete(universityId);
        res.status(200).json(university);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

module.exports = router;