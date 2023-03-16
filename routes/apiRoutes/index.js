const express = require('express');
const router = express.Router();

router.use(require('./employee'));
router.use(require('./department'));

module.exports = router;