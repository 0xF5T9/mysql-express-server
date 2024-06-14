/**
 * @file register.js
 * @description Register services.
 */

'use strict';
const database = require('./database');

/**
 * Validate the register input.
 * @returns {{success: Boolean, message: String}} Returns the result object.
 */
function validateRegisterInput(username, password, email) {
    if (!/^[a-zA-Z0-9]+$/.test(username))
        return {
            success: false,
            message: 'The username contains invalid character(s). [a-zA-Z0-9]',
        };
    if (username.length < 6 || username.length > 16)
        return {
            success: false,
            message:
                'The username must have a minimum length of 6 characters and a maximum of 16 characters.',
        };

    if (password.length < 8 || username.length > 32)
        return {
            success: false,
            message:
                'The password must have a minimum length of 8 characters and a maximum of 32 characters.',
        };

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return {
            success: false,
            message: 'The email address is invalid.',
        };

    return { success: true, message: 'Successfully.' };
}

/**
 * Check if the unique inputs is already exist.
 * @param {String} username Username.
 * @param {String} email Email.
 * @return {Promise<{isDuplicate: Boolean, isServerError: Boolean, message: String}>} Returns the result object.
 */
async function checkDuplicate(username, email) {
    try {
        const username_sql = `SELECT id FROM users WHERE username = ?`,
            username_result = await database.query(username_sql, [username]);
        if (username_result.length)
            return {
                isDuplicate: true,
                isServerError: false,
                message: 'Username already exists.',
            };

        const email_sql = `SELECT id FROM users WHERE email = ?`,
            email_result = await database.query(email_sql, [email]);
        if (email_result.length)
            return {
                isDuplicate: true,
                isServerError: false,
                message: 'Email already exists.',
            };

        return {
            isDuplicate: false,
            isServerError: false,
            message: 'No duplicate found.',
        };
    } catch (error) {
        console.error(error);
        return {
            isDuplicate: undefined,
            isServerError: true,
            message: 'Unexpected server error occurred.',
        };
    }
}

/**
 * Create an account.
 * @param {String} username Account username.
 * @param {String} password Account password.
 * @param {String} email Account email.
 * @returns {Promise<{success: Boolean, isServerError: Boolean, message: String, data: ?Object}>} Returns the result object.
 */
async function createAccount(username, password, email) {
    let user_insert_id;
    try {
        const sql_user = `INSERT INTO users (username, email) VALUES (?, ?)`,
            user_result = await database.query(sql_user, [username, email]);
        if (!user_result.affectedRows)
            return {
                success: false,
                isServerError: true,
                message: 'Unexpected server error occurred.',
                data: null,
            };
        user_insert_id = user_result.insertId;

        const sql_credentials = `INSERT INTO credentials (password, username) VALUES (?, ?)`,
            credentials_result = await database.query(sql_credentials, [
                password,
                username,
            ]);
        if (!credentials_result.affectedRows) {
            await database.query(
                `DELETE FROM users WHERE id = ${user_insert_id}`
            );
            return {
                success: false,
                isServerError: true,
                message: 'Unexpected server error occurred.',
                data: null,
            };
        }

        return {
            success: true,
            isServerError: false,
            message: 'Successfully created the account.',
            data: null,
        };
    } catch (error) {
        await database.query(`DELETE FROM users WHERE id = ${user_insert_id}`);
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
    validateRegisterInput,
    checkDuplicate,
    createAccount,
};
