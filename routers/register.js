/**
 * @file register.js
 * @description Register router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/register');

// Register account.
router.post('/', controller.register);

module.exports = router;
