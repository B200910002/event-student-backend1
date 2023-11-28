var express = require('express');
var router = express.Router();
const { protect, uploadImage } = require('../middleware/middleware')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// upload image
router.post('/upload-image', protect, uploadImage);

module.exports = router;
