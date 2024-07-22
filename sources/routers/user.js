/**
 * @file user.js
 * @description User router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/user'),
    { authenticateUsername } = require('../models/authorize');

// Get user information.
router.get('/:username', authenticateUsername, controller.getInfo);

module.exports = router;
