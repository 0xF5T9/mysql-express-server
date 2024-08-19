/**
 * @file register.ts
 * @description Register router models.
 */

'use strict';
import bcrypt from 'bcrypt';
import { query } from '../services/database';
import { ModelError, ModelResponse } from '../utility/model';

/**
 * Validate the register input.
 * @param username Account username.
 * @param password Account password.
 * @param email Account email.
 * @returns Returns the response object.
 */
async function validateRegisterInput(
    username: string,
    password: string,
    email: string
) {
    try {
        if (!/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email))
            throw new ModelError('The email address is invalid.', false, 400);

        if (!/^[a-zA-Z0-9]+$/.test(username))
            throw new ModelError(
                'The username contains invalid character(s). [a-zA-Z0-9]',
                false,
                400
            );

        if (username.length < 6 || username.length > 16)
            throw new ModelError(
                'The username must have a minimum length of 6 characters and a maximum of 16 characters.',
                false,
                400
            );

        if (password.length < 8 || username.length > 32)
            throw new ModelError(
                'The password must have a minimum length of 8 characters and a maximum of 32 characters.',
                false,
                400
            );

        return new ModelResponse('Successfully.', true, null);
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
 * Check if the account information is duplicate.
 * @param username Account username.
 * @param email Account email.
 * @return Returns the response object.
 */
async function checkDuplicate(username: string, email: string) {
    try {
        const usernameSql = `SELECT id FROM users WHERE username = ?`,
            usernameResult: any = await query(usernameSql, [username]);
        if (usernameResult.length)
            throw new ModelError('Username already exists.', false, 400);

        const emailSql = `SELECT id FROM users WHERE email = ?`,
            emailResult: any = await query(emailSql, [email]);
        if (emailResult.length)
            throw new ModelError('Email already exists.', false, 400);

        return new ModelResponse(
            'All tests passed, no duplicates were found.',
            true,
            null
        );
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new ModelResponse(
            error.isServerError === false
                ? error.message
                : 'Unexpeced server error has occurred.',
            false,
            null,
            error.isServerError,
            error.statusCode
        );
    }
}

/**
 * Hash password using bcrypt.
 * @param password Password string.
 * @param saltRounds Salt rounds. (default: 10)
 * @returns Returns the response object.
 */
async function hashPassword(password: string, saltRounds: number = 10) {
    try {
        const salt = await bcrypt.genSalt(saltRounds),
            hashedPassword = await bcrypt.hash(password, salt);

        return new ModelResponse('Successfully hashed the password', true, {
            generatedSalt: salt,
            hashedPassword,
        });
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
 * Create an account.
 * @param username Account username.
 * @param password Account password.
 * @param email Account email.
 * @returns Returns the response object.
 */
async function createAccount(
    username: string,
    password: string,
    email: string
) {
    let userInsertId;
    try {
        const sqlUser = `INSERT INTO users (username, email) VALUES (?, ?)`,
            userResult: any = await query(sqlUser, [username, email]);
        if (!userResult.affectedRows)
            throw new ModelError(
                'Failed to insert user record to the database.',
                true,
                500
            );
        userInsertId = userResult.insertId;

        const sqlCredentials = `INSERT INTO credentials (password, username) VALUES (?, ?)`,
            credentialsResult: any = await query(sqlCredentials, [
                password,
                username,
            ]);
        if (!credentialsResult.affectedRows)
            throw new ModelError(
                'Failed to insert user credential record to the database.',
                true,
                500
            );

        return new ModelResponse(
            'Successfully created the account.',
            true,
            null
        );
    } catch (error) {
        if (userInsertId)
            await query(`DELETE FROM users WHERE id = ${userInsertId}`);
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

export default {
    validateRegisterInput,
    checkDuplicate,
    hashPassword,
    createAccount,
};
