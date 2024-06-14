/**
 * @file user.js
 * @description User services.
 */

'use strict';
const database = require('./database');

/**
 * Get the user information.
 * @param {String} username Username.
 * @returns {Promise<{success: Boolean, isServerError: Boolean, message: String, data:?Object}>} Returns the result object.
 */
async function getInfo(username) {
    try {
        let data;
        const sql = `SELECT username, email FROM users WHERE username = ?`,
            result = await database.query(sql, [username]),
            is_valid = !!result.length,
            message = is_valid ? 'Success.' : 'No information found.';
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

module.exports = {
    getInfo,
};
