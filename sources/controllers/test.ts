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

        const postsResult = await model.getPosts(
            parseInt(page as string) || undefined
        );
        if (!postsResult.success)
            return response.status(postsResult.statusCode).json({
                message: postsResult.message,
            });

        return response.status(postsResult.statusCode).json({
            message: 'Successfully.',
            data: postsResult.data,
        });
    };
}

export default new TestController();
