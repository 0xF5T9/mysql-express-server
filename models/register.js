/**
 * @file register.js
 * @description Register router models.
 */

'use strict';
const database = require('../services/database'),
    {
        ModelError: Error,
        ModelResponse: Response,
    } = require('../utility/model');

/**
 * Validate the register input.
 * @param {String} username Account username.
 * @param {String} password Account password.
 * @param {String} email Account email.
 * @returns {Promise<Response>} Returns the response object.
 */
async function validateRegisterInput(username, password, email) {
    try {
        if (!/^[a-zA-Z0-9]+$/.test(username))
            throw new Error(
                'The username contains invalid character(s). [a-zA-Z0-9]'
            );

        if (username.length < 6 || username.length > 16)
            throw new Error(
                'The username must have a minimum length of 6 characters and a maximum of 16 characters.'
            );

        if (password.length < 8 || username.length > 32)
            throw new Error(
                'The password must have a minimum length of 8 characters and a maximum of 32 characters.'
            );

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            throw new Error('The email address is invalid.');

        return new Response('Successfully.', true);
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Response(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError
        );
    }
}

/**
 * Check if the account information is duplicate.
 * @param {String} username Account username.
 * @param {String} email Account email.
 * @return {Promise<Response>} Returns the response object.
 */
async function checkDuplicate(username, email) {
    try {
        const username_sql = `SELECT id FROM users WHERE username = ?`,
            username_result = await database.query(username_sql, [username]);
        if (username_result.length) throw new Error('Username already exists.');

        const email_sql = `SELECT id FROM users WHERE email = ?`,
            email_result = await database.query(email_sql, [email]);
        if (email_result.length) throw new Error('Email already exists.');

        return new Response(
            'All tests passed, no duplicates were found.',
            true
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

/**
 * Create an account.
 * @param {String} username Account username.
 * @param {String} password Account password.
 * @param {String} email Account email.
 * @returns {Promise<Response>} Returns the response object.
 */
async function createAccount(username, password, email) {
    let user_insert_id;
    try {
        const sql_user = `INSERT INTO users (username, email) VALUES (?, ?)`,
            user_result = await database.query(sql_user, [username, email]);
        if (!user_result.affectedRows)
            throw new Error(
                'Failed to insert user record to the database.',
                true
            );
        user_insert_id = user_result.insertId;

        const sql_credentials = `INSERT INTO credentials (password, username) VALUES (?, ?)`,
            credentials_result = await database.query(sql_credentials, [
                password,
                username,
            ]);
        if (!credentials_result.affectedRows)
            throw new Error(
                'Failed to insert user credential record to the database.',
                true
            );

        return new Response('Successfully created the account.', true);
    } catch (error) {
        if (user_insert_id)
            await database.query(
                `DELETE FROM users WHERE id = ${user_insert_id}`
            );
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Response(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError
        );
    }
}

module.exports = {
    validateRegisterInput,
    checkDuplicate,
    createAccount,
};
