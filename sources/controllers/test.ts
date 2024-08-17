/**
 * @file test.ts
 * @description Test router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import model from '../models/test';

/**
 * Test router controller.
 */
class TestController {
    // [GET] /test/posts
    getTestPosts: RequestHandler = async (request, response, next) => {
        const { page } = request.query;

        const posts_result = await model.getPosts(
            parseInt(page as string) || undefined
        );
        if (!posts_result.success)
            return response.status(posts_result.statusCode).json({
                message: posts_result.message,
            });

        return response.status(posts_result.statusCode).json({
            message: 'Successfully.',
            data: posts_result.data,
        });
    };
}

export default new TestController();
