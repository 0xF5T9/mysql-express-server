/**
 * @file authorization.js
 * @description Authorization routes.
 */

'use strict';
const express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    authorizationService = require('../services/authorization');

// Authenticate a user and return a JSON Web Token (JWT) upon success.
router.post('/', async function (request, result, next) {
    const { username, password } = request.body;

    if (!username || !password)
        return result.status(400).json({
            message:
                'Credential information was not provided or was incomplete.',
        });

    const verify_result = await authorizationService.verifyAccount(
        username,
        password
    );
    if (!verify_result.success)
        return result
            .status(verify_result.isServerError ? 500 : 401)
            .json({ message: verify_result.message });

    const token = jwt.sign(
        {
            username: verify_result.data.username,
            email: verify_result.data.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    return result.status(200).json({
        message: 'Successfully authorized.',
        token,
    });
});

// Verify a JWT token. (Debug)
router.post('/verifyToken', async function (request, result, next) {
    if (process.env.NODE_ENV === 'production')
        return result.status(404).json({ message: 'Not available.' });

    const full_token = request.get('Authorization');
    if (!full_token)
        return result.status(400).json({ message: 'No token was provided.' });

    try {
        const token = full_token.split(' ')[1],
            verifyResult = jwt.verify(token, process.env.SECRET_KEY);
        return result.status(200).json({
            message: 'Successfully verified the token.',
            verifyResult,
        });
    } catch (error) {
        console.error(error);
        return result
            .status(401)
            .json({ message: 'Authenticate: ' + error.message });
    }
});

module.exports = router;
