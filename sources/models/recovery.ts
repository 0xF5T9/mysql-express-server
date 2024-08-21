/**
 * @file recovery.ts
 * @description Recovery router models.
 */

'use strict';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../services/database';
import { ModelError, ModelResponse } from '../utility/model';
import nodemailerConfig from '../../configs/nodemailer.json';

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
 * Forgot password.
 * @param email Email address.
 * @returns Returns the response object.
 */
async function forgotPassword(email: string) {
    try {
        if (!email)
            throw new ModelError('No email address was provided.', false, 400);

        if (!/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email))
            throw new ModelError('The email address is invalid.', false, 400);

        const userResult: any = await query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        if (!!!userResult.length)
            return new ModelResponse(
                'Check your email for a password reset link.',
                true,
                null
            );

        const credentialResult: any = await query(
            `SELECT * FROM credentials WHERE username = ?`,
            [userResult[0].username]
        );
        if (!!!credentialResult.length)
            throw new ModelError(
                'Failed to retrieve user credentials.',
                true,
                500
            );

        const { username, password } = credentialResult[0],
            resetToken = jwt.sign(
                {
                    username,
                },
                password,
                {
                    expiresIn: '1h',
                }
            );

        const transporter = nodemailer.createTransport(
            nodemailerConfig.transporterOptions
        );

        await transporter.sendMail({
            from: nodemailerConfig.resetPasswordSendMailOptions.from,
            to: email,
            subject: nodemailerConfig.resetPasswordSendMailOptions.subject,
            html: `<a href="${nodemailerConfig.resetPasswordSendMailOptions.frontEndDomain}/reset-password?token=${resetToken}">Click this link to reset your password</a>`,
        });

        return new ModelResponse(
            'Check your email for a password reset link.',
            true,
            null
        );
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
 * Reset password.
 * @param token Reset password token.
 * @param newPassword New account password.
 * @returns Returns the response object.
 */
async function resetPassword(token: string, newPassword: string) {
    try {
        if (!token)
            throw new ModelError('No reset token was provided.', false, 400);

        if (!newPassword)
            throw new ModelError('No new password was provided.', false, 400);

        if (newPassword.length < 8 || newPassword.length > 32)
            throw new ModelError(
                'The password must have a minimum length of 8 characters and a maximum of 32 characters.',
                false,
                400
            );

        const decoded: any = jwt.decode(token);
        if (!decoded) throw new ModelError('Invalid token.', false, 401);

        const credentialResult: any = await query(
            `SELECT * FROM credentials WHERE username = ?`,
            [decoded.username]
        );
        if (!!!credentialResult.length)
            throw new ModelError(
                'Failed to retrieve user credentials.',
                true,
                500
            );

        if (!jwt.verify(token, credentialResult[0].password))
            throw new ModelError('Invalid token.', false, 401);

        const hashResult = await hashPassword(newPassword);
        if (!hashResult.success)
            throw new ModelError(hashResult.message, true, 500);

        const updateResult: any = await query(
            `UPDATE credentials SET password = ? WHERE username = ?`,
            [hashResult.data.hashedPassword, decoded.username]
        );
        if (!updateResult.affectedRows)
            throw new ModelError(
                'Failed to update the user password.',
                true,
                500
            );

        return new ModelResponse(
            'Successfully updated the password.',
            true,
            null
        );
    } catch (error) {
        if (
            (error?.message as string)
                .toLowerCase()
                .includes('invalid signature')
        )
            return new ModelResponse('Invalid token.', false, null, false, 401);
        if ((error?.message as string).toLowerCase().includes('expired'))
            return new ModelResponse(
                'This password reset request has expired. Please try again.',
                false,
                null,
                false,
                401
            );

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

export default { forgotPassword, resetPassword };
