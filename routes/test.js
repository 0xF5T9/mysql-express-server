/**
 * @file test.js
 * @description Test routes.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    testService = require('../services/test');

// Get test posts.
router.get('/posts', async function (request, result, next) {
    const { page } = request.query;

    const posts_result = await testService.getPosts(page);
    if (!posts_result.success)
        return result.status(posts_result.statusCode).json({
            message: posts_result.message,
        });

    return result.status(posts_result.statusCode).json({
        message: 'Successfully.',
        data: posts_result.data,
    });
});

module.exports = router;
