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
 * Middleware that ensures the 'username' parameter is authentic.
 * @note Authenticate middleware for protect API endpoints from unauthorized access.
 * @param request Express middleware request object.
 * @param response Express middleware response object.
 * @param next Express middleware next() function.
 * @returns Returns the response object.
 */
const authenticateUsername: RequestHandler = (request, response, next) => {
    const fullToken = request.get('Authorization');
    if (!fullToken)
        return response.status(400).json({ message: 'No token was provided.' });

    try {
        const token = fullToken.split(' ')[1],
            verifyResult: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { username } = request.params;
        if (username.toLowerCase() !== verifyResult.username.toLowerCase())
            return response.status(403).json({ message: 'Access denied.' });
        request.params.username = verifyResult.username;
        next();
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

/**
 * Middleware that ensures the user is an admin user.
 * @note Authenticate middleware for protect API endpoints from unauthorized access.
 * @param {Object} request Express middleware request object.
 * @param {Object} response Express middleware response object.
 * @param {Function} next Express middleware next() function.
 * @returns {Object} Returns the response object.
 */
const authenticateAdmin: RequestHandler = (request, response, next) => {
    const fullToken = request.get('Authorization');
    if (!fullToken)
        return response.status(400).json({ message: 'No token was provided.' });

    try {
        const token = fullToken.split(' ')[1],
            verifyResult: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (verifyResult.role !== 'admin')
            return response.status(403).json({ message: 'Access denied.' });
        next();
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

export default { verifyAccount, authenticateUsername, authenticateAdmin };
