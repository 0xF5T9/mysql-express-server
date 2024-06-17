/**
 * @file user.js
 * @description User services.
 */

'use strict';
const database = require('./database'),
    {
        ServiceError: Error,
        ServiceResult: Result,
    } = require('../utility/services');

/**
 * Get the user information.
 * @param {String} username Username.
 * @returns {Promise<Result>} Returns the result object.
 */
async function getInfo(username) {
    try {
        const sql = `SELECT username, email FROM users WHERE username = ?`;

        const result = await database.query(sql, [username]);
        if (!!!result.length)
            throw new Error('No user information were found.', true);

        const user_info = result[0];

        return new Result(
            'Successfully retrieved the user information.',
            true,
            user_info
        );
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Result(
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
