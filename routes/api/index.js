var express = require('express');
var router = express.Router();

router.use('/tv', require('./tv'))
router.use('/movies', require('./movies'))

module.exports = router;