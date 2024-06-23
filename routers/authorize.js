/**
 * @file authorize.js
 * @description Authorize router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/authorize');

// Authenticate a user and return a JSON Web Token (JWT) upon success.
router.post('/', controller.authorize);

// Verify a JWT token. (Debug)
router.post('/verifyToken', controller.verifyToken);

module.exports = router;
