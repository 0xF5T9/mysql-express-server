/**
 * @file user.ts
 * @description User router models.
 */

'use strict';
import { query } from '../services/database';
import { ModelError, ModelResponse } from '../utility/model';

/**
 * Get the user information.
 * @param username Username.
 * @returns Returns the response object.
 */
async function getInfo(username: string) {
    try {
        const sql = `SELECT username, email, role, createdAt FROM users WHERE username = ?`;

        const result: any = await query(sql, [username]);
        if (!!!result.length)
            throw new ModelError('No user information were found.', true, 500);

        const userInfo = result[0];

        return new ModelResponse(
            'Successfully retrieved the user information.',
            true,
            userInfo
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

export default { getInfo };
