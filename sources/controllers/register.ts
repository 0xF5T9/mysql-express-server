/**
 * @file register.ts
 * @description Register router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import model from '../models/register';

/**
 * Register router controller.
 */
class RegisterController {
    // [POST] /register
    register: RequestHandler = async (request, response, next) => {
        const { username, password, email } = request.body;

        if (!username || !password || !email)
            return response.status(400).json({
                message:
                    'Account information was not provided or was incomplete.',
            });

        const input_validate_result = await model.validateRegisterInput(
            username,
            password,
            email
        );
        if (!input_validate_result.success)
            return response.status(input_validate_result.statusCode).json({
                message: input_validate_result.message,
            });

        const duplicate_result = await model.checkDuplicate(username, email);
        if (!duplicate_result.success)
            return response.status(duplicate_result.statusCode).json({
                message: duplicate_result.message,
            });

        const hash_result = await model.hashPassword(password);
        if (!hash_result.success)
            return response.status(hash_result.statusCode).json({
                message: hash_result.message,
            });

        const register_result = await model.createAccount(
            username,
            hash_result.data.hashedPassword,
            email
        );
        if (!register_result.success)
            return response
                .status(register_result.statusCode)
                .json({ message: register_result.message });

        return response.status(201).json({
            message: 'Successfully registered the account.',
        });
    };
}

export default new RegisterController();
