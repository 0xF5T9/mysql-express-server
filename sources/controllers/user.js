/**
 * @file user.js
 * @description User router controller.
 */

'use strict';
const models = require('../models/user');

/**
 * User router controller.
 */
class UserController {
    // [GET] /user/:username
    async getInfo(request, response, next) {
        const { username } = request.params;

        const user_result = await models.getInfo(username);
        if (!user_result.success)
            return response.status(user_result.statusCode).json({
                message: user_result.message,
            });

        return response.status(user_result.statusCode).json({
            message: user_result.message,
            data: user_result.data,
        });
    }
}

module.exports = new UserController();
