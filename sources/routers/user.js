/**
 * @file user.js
 * @description User router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/user'),
    { authenticate } = require('../models/authorize');

// Get user information.
router.get('/:username', authenticate, controller.getInfo);

module.exports = router;
