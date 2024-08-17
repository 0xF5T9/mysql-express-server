/**
 * @file authorize.ts
 * @description Authorize router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import model from '../models/authorize';

/**
 * Authorize router controller.
 */
class AuthorizeController {
    // [POST] /authorize
    authorize: RequestHandler = async (request, response, next) => {
        const { username, password } = request.body;

        if (!username || !password)
            return response.status(400).json({
                message:
                    'Credential information was not provided or was incomplete.',
            });

        const verify_result = await model.verifyAccount(username, password);
        if (!verify_result.success)
            return response
                .status(verify_result.statusCode)
                .json({ message: verify_result.message });

        const token = jwt.sign(
            {
                username: verify_result.data.username,
                email: verify_result.data.email,
                role: verify_result.data.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return response.status(verify_result.statusCode).json({
            message: 'Successfully authorized.',
            data: {
                username: verify_result.data.username,
                email: verify_result.data.email,
                role: verify_result.data.role,
                token,
            },
        });
    };

    // [POST] /authorize/verifyToken
    verifyToken: RequestHandler = async (request, response, next) => {
        const full_token = request.get('Authorization');
        if (!full_token)
            return response
                .status(400)
                .json({ message: 'No token was provided.' });

        try {
            const token = full_token.split(' ')[1],
                verifyResult = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return response.status(200).json({
                message: 'Successfully verified the token.',
                data: verifyResult,
            });
        } catch (error) {
            console.error(error);
            const is_expired = error.name.toLowerCase().includes('expire');
            return response.status(401).json({
                message: is_expired
                    ? 'Session expired.'
                    : 'Invalid session detected. This incident will be reported.',
            });
        }
    };
}

export default new AuthorizeController();
