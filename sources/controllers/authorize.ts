/**
 * @file authorize.ts
 * @description Authorize router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import model from '../models/authorize';
import jwtConfig from '../../configs/jwt.json';

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
            verifyResult.data.password,
            { expiresIn: jwtConfig.jwtAuthorizeTokenExpiresIn }
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
        const { token } = request.body;

        const verifyResult = await model.verifyToken(token);
        if (!verifyResult.success)
            return response
                .status(verifyResult.statusCode)
                .json({ message: verifyResult.message });

        return response
            .status(verifyResult.statusCode)
            .json({ message: verifyResult.message, data: verifyResult.data });
    };
}

export default new AuthorizeController();
