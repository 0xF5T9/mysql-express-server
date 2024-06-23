/**
 * @file register.js
 * @description Register router controller.
 */

'use strict';
const models = require('../models/register');

/**
 * Register router controller.
 */
class RegisterController {
    // [POST] /register
    async register(request, response, next) {
        const { username, password, email } = request.body;

        if (!username || !password || !email)
            return response.status(400).json({
                message:
                    'Account information was not provided or was incomplete.',
            });

        const input_validate_result = await models.validateRegisterInput(
            username,
            password,
            email
        );
        if (!input_validate_result.success)
            return response.status(input_validate_result.statusCode).json({
                message: input_validate_result.message,
            });

        const duplicate_result = await models.checkDuplicate(username, email);
        if (!duplicate_result.success)
            return response.status(duplicate_result.statusCode).json({
                message: duplicate_result.message,
            });

        const register_result = await models.createAccount(
            username,
            password,
            email
        );
        if (!register_result.success)
            return response
                .status(register_result.statusCode)
                .json({ message: register_result.message });

        return response.status(201).json({
            message: 'Successfully registered the account.',
        });
    }
}

module.exports = new RegisterController();
