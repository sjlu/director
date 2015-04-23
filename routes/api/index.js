var express = require('express');
var router = express.Router();

router.use('/tv', require('./tv'))

module.exports = router;