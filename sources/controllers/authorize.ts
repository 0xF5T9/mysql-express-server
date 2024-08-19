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

        const verifyResult = await model.verifyAccount(username, password);
        if (!verifyResult.success)
            return response
                .status(verifyResult.statusCode)
                .json({ message: verifyResult.message });

        const token = jwt.sign(
            {
                username: verifyResult.data.username,
                email: verifyResult.data.email,
                role: verifyResult.data.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return response.status(verifyResult.statusCode).json({
            message: 'Successfully authorized.',
            data: {
                username: verifyResult.data.username,
                email: verifyResult.data.email,
                role: verifyResult.data.role,
                token,
            },
        });
    };

    // [POST] /authorize/verifyToken
    verifyToken: RequestHandler = async (request, response, next) => {
        const fullToken = request.get('Authorization');
        if (!fullToken)
            return response
                .status(400)
                .json({ message: 'No token was provided.' });

        try {
            const token = fullToken.split(' ')[1],
                verifyResult = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return response.status(200).json({
                message: 'Successfully verified the token.',
                data: verifyResult,
            });
        } catch (error) {
            console.error(error);
            const isExpired = error.name.toLowerCase().includes('expire');
            return response.status(401).json({
                message: isExpired
                    ? 'Session expired.'
                    : 'Invalid session detected. This incident will be reported.',
            });
        }
    };
}

export default new AuthorizeController();
