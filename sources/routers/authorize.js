/**
 * @file authorize.js
 * @description Authorize router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/authorize');

const { rateLimit } = require('express-rate-limit'),
    authorizeLimiter = rateLimit({
        // 10 requests per 1 minutes.
        windowMs: 60 * 60 * 1000,
        limit: 10,
        standardHeaders: 'draft-7',
        legacyHeaders: true,
        message: 'Please try again later.',
        handler: (request, response, next, options) => {
            return response
                .status(429)
                .json({ message: 'Please try again later.' });
        },
    });

// Authenticate a user and return a JSON Web Token (JWT) upon success.
router.post('/', authorizeLimiter, controller.authorize);

// Verify user token.
router.post('/verifyToken', controller.verifyToken);

module.exports = router;
