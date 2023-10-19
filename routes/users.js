const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/protect')
const { User } = require('../models/User.model')

/* GET users listing. */
router.get('/', protect, function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
