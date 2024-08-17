/**
 * @file user.ts
 * @description User router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import model from '../models/user';

/**
 * User router controller.
 */
class UserController {
    // [GET] /user/:username
    getInfo: RequestHandler = async (request, response, next) => {
        const { username } = request.params;

        const user_result = await model.getInfo(username);
        if (!user_result.success)
            return response.status(user_result.statusCode).json({
                message: user_result.message,
            });

        return response.status(user_result.statusCode).json({
            message: user_result.message,
            data: user_result.data,
        });
    };
}

export default new UserController();
