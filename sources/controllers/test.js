/**
 * @file test.js
 * @description Test router controller.
 */

'use strict';
const models = require('../models/test');

/**
 * Test router controller.
 */
class TestController {
    // [GET] /test/posts
    async getTestPosts(request, response, next) {
        const { page } = request.query;

        const posts_result = await models.getPosts(page);
        if (!posts_result.success)
            return response.status(posts_result.statusCode).json({
                message: posts_result.message,
            });

        return response.status(posts_result.statusCode).json({
            message: 'Successfully.',
            data: posts_result.data,
        });
    }
}

module.exports = new TestController();
