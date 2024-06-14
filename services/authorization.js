/**
 * @file authorization.js
 * @description Authorization services.
 */

'use strict';
const database = require('./database'),
    jwt = require('jsonwebtoken');

/**
 * Verify account credentials.
 * @param {String} username Account username.
 * @param {String} password Account password.
 * @returns {Promise<{success: Boolean, isServerError: Boolean, message: String, data: ?Object}>} Returns the result object.
 */
async function verifyAccount(username, password) {
    try {
        let data;
        const sql = `SELECT c.username, u.email
                     FROM credentials c JOIN users u 
                     ON c.username = u.username 
                     WHERE c.username = ? AND BINARY c.password = ?`,
            result = await database.query(sql, [username, password]),
            is_valid = !!result.length,
            message = is_valid
                ? 'Account credentials verified.'
                : 'Invalid account credentials.';
        data = is_valid ? result[0] : null;

        return { success: is_valid, isServerError: false, message, data };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            isServerError: true,
            message: 'Unexpected server error occurred.',
            data: null,
        };
    }
}

/**
 * Authenticate middleware for protect API endpoints from unauthorized access.
 * @param {Object} request Express middleware request object.
 * @param {Object} result Express middleware result object.
 * @param {Function} next Express middleware next() function.
 * @returns {Object} Returns the result object.
 */
function authenticate(request, result, next) {
    const full_token = request.get('Authorization');
    if (!full_token)
        return result.status(400).json({ message: 'No token was provided.' });

    try {
        const token = full_token.split(' ')[1],
            verifyResult = jwt.verify(token, process.env.SECRET_KEY);

        const { username } = request.params;
        if (username.toLowerCase() !== verifyResult.username.toLowerCase())
            return result.status(401).json({ message: 'Unauthorized access.' });
        request.params.username = verifyResult.username;
        next();
    } catch (error) {
        console.error(error);
        return result
            .status(401)
            .json({ message: 'Authenticate: ' + error.message });
    }
}

module.exports = {
    verifyAccount,
    authenticate,
};
