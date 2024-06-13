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
        return result.status(user_result.isServerError ? 500 : 502).json({
            message: user_result.message,
        });

    return result.status(200).json({
        message: 'Successfully retrieved the user data.',
        data: user_result.data,
    });
});

module.exports = router;
