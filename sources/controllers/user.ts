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

        const userResult = await model.getInfo(username);
        if (!userResult.success)
            return response.status(userResult.statusCode).json({
                message: userResult.message,
            });

        return response.status(userResult.statusCode).json({
            message: userResult.message,
            data: userResult.data,
        });
    };
}

export default new UserController();
