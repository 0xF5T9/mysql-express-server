/**
 * @file authorize.ts
 * @description Authorize router models.
 */

'use strict';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../services/database';
import { ModelError, ModelResponse } from '../utility/model';

/**
 * Verify account credentials.
 * @param username Account username.
 * @param password Account password.
 * @returns Returns the response object.
 */
async function verifyAccount(username: string, password: string) {
    try {
        const sql = `SELECT c.username, c.password, u.email, u.role
                     FROM credentials c JOIN users u 
                     ON c.username = u.username 
                     WHERE c.username = ?`;

        const result: any = await query(sql, [username]);
        if (!!!result.length)
            throw new ModelError('Invalid username or password.', false, 401);

        const compareResult = await bcrypt.compare(
            password,
            result[0].password
        );
        if (!compareResult)
            throw new ModelError('Invalid username or password.', false, 401);

        const user = {
            username: result[0].username,
            password: result[0].password,
            email: result[0].email,
            role: result[0].role,
        };

        return new ModelResponse('Login successful.', true, user);
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new ModelResponse(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError,
            error.statusCode
        );
    }
}

/**
 * Verify authorization token.
 * @param token Token.
 * @returns Returns the response object.
 */
async function verifyToken(token: string) {
    try {
        if (!token) throw new ModelError('No token was provided', false, 400);

        const decoded: any = jwt.decode(token);
        if (!decoded) throw new ModelError('Invalid token.', false, 401);

        const credentialResult: any = await query(
            `SELECT * FROM credentials WHERE username = ?`,
            [decoded.username]
        );
        if (!!!credentialResult.length)
            throw new ModelError('Invalid token.', false, 401);

        const verifyResult: any = jwt.verify(
            token,
            credentialResult[0].password
        );

        return new ModelResponse(
            'Successfully verified the token.',
            true,
            verifyResult,
            false,
            200
        );
    } catch (error) {
        if ((error?.message as string).toLowerCase().includes('expire'))
            return new ModelResponse(
                'Session expired.',
                false,
                null,
                false,
                401
            );
        if (
            (error?.message as string)
                .toLowerCase()
                .includes('invalid signature')
        )
            return new ModelResponse('Invalid token.', false, null, false, 401);

        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new ModelResponse(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError,
            error.statusCode
        );
    }
}

/**
 * Middleware that ensures the 'username' parameter is authentic.
 * @note Authenticate middleware for protect API endpoints from unauthorized access.
 * @param request Express middleware request object.
 * @param response Express middleware response object.
 * @param next Express middleware next() function.
 * @returns Returns the response object.
 */
const authenticateUsername: RequestHandler = async (
    request,
    response,
    next
) => {
    const fullToken = request.get('Authorization');
    if (!fullToken)
        return response.status(400).json({ message: 'No token was provided.' });

    const token = fullToken.split(' ')[1];

    const verifyResult = await verifyToken(token);
    if (!verifyResult.success)
        return response.status(401).json({ message: verifyResult.message });

    const { username } = request.params;
    if (username.toLowerCase() !== verifyResult.data.username.toLowerCase())
        return response.status(403).json({ message: 'Access denied.' });
    request.params.username = verifyResult.data.username;
    next();
};

/**
 * Middleware that ensures the user is an admin user.
 * @note Authenticate middleware for protect API endpoints from unauthorized access.
 * @param request Express middleware request object.
 * @param response Express middleware response object.
 * @param next Express middleware next() function.
 * @returns Returns the response object.
 */
const authenticateAdmin: RequestHandler = async (request, response, next) => {
    const fullToken = request.get('Authorization');
    if (!fullToken)
        return response.status(400).json({ message: 'No token was provided.' });

    const token = fullToken.split(' ')[1];

    const verifyResult: any = await verifyToken(token);
    if (!verifyResult.success)
        return response.status(401).json({ message: verifyResult.message });

    if (verifyResult.role !== 'admin')
        return response.status(403).json({ message: 'Access denied.' });
    next();
};

export default {
    verifyAccount,
    verifyToken,
    authenticateUsername,
    authenticateAdmin,
};
