/**
 * @file user.js
 * @description User routes.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    { authenticate } = require('../services/authorization'),
    userService = require('../services/user');

// Get user information.
router.get('/:username', authenticate, async function (request, result, next) {
    const { username } = request.params;

    const user_result = await userService.getInfo(username);
    if (!user_result.success)
        return result.status(user_result.statusCode).json({
            message: user_result.message,
        });

    return result.status(user_result.statusCode).json({
        message: user_result.message,
        data: user_result.data,
    });
});

module.exports = router;
