/**
 * @file user.js
 * @description User router models.
 */

'use strict';
const database = require('../services/database'),
    {
        ModelError: Error,
        ModelResponse: Response,
    } = require('../utility/model');

/**
 * Get the user information.
 * @param {String} username Username.
 * @returns {Promise<Response>} Returns the response object.
 */
async function getInfo(username) {
    try {
        const sql = `SELECT username, email FROM users WHERE username = ?`;

        const result = await database.query(sql, [username]);
        if (!!!result.length)
            throw new Error('No user information were found.', true);

        const user_info = result[0];

        return new Response(
            'Successfully retrieved the user information.',
            true,
            user_info
        );
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Response(
            error.isServerError === false
                ? error.message
                : 'Unexpeced server error has occurred.',
            false,
            null,
            error.isServerError
        );
    }
}

module.exports = {
    getInfo,
};
