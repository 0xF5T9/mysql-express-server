/**
 * @file authorize.js
 * @description Authorize router models.
 */

'use strict';
const database = require('../services/database'),
    jwt = require('jsonwebtoken'),
    {
        ModelError: Error,
        ModelResponse: Response,
    } = require('../utility/model');

/**
 * Verify account credentials.
 * @param {String} username Account username.
 * @param {String} password Account password.
 * @returns {Promise<ModelResponse>} Returns the response object.
 */
async function verifyAccount(username, password) {
    try {
        const sql = `SELECT c.username, u.email
                     FROM credentials c JOIN users u 
                     ON c.username = u.username 
                     WHERE c.username = ? AND BINARY c.password = ?`;

        const result = await database.query(sql, [username, password]);

        if (!!!result.length)
            throw new Error('Invalid account credentials.', false, 401);
        const user = result[0];

        return new Response('Account credentials verified.', true, user);
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Response(
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
 * Authenticate middleware for protect API endpoints from unauthorized access.
 * @param {Object} request Express middleware request object.
 * @param {Object} response Express middleware response object.
 * @param {Function} next Express middleware next() function.
 * @returns {Object} Returns the response object.
 */
function authenticate(request, response, next) {
    const full_token = request.get('Authorization');
    if (!full_token)
        return response.status(400).json({ message: 'No token was provided.' });

    try {
        const token = full_token.split(' ')[1],
            verifyResult = jwt.verify(token, process.env.SECRET_KEY);

        const { username } = request.params;
        if (username.toLowerCase() !== verifyResult.username.toLowerCase())
            return response
                .status(401)
                .json({ message: 'Unauthorized access.' });
        request.params.username = verifyResult.username;
        next();
    } catch (error) {
        console.error(error);
        return response
            .status(401)
            .json({ message: 'Authenticate: ' + error.message });
    }
}

module.exports = {
    verifyAccount,
    authenticate,
};
