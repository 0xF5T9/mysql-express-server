/**
 * @file register.js
 * @description Register routes.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    registerService = require('../services/register');

// Register account.
router.post('/', async function (request, result, next) {
    const { username, password, email } = request.body;

    if (!username || !password || !email)
        return result.status(400).json({
            message: 'Account information was not provided or was incomplete.',
        });

    const input_validate_result = registerService.validateRegisterInput(
        username,
        password,
        email
    );
    if (!input_validate_result.success)
        return result.status(400).json({
            message: input_validate_result.message,
        });

    const duplicate_result = await registerService.checkDuplicate(
        username,
        email
    );
    if (duplicate_result.isDuplicate)
        return result.status(400).json({ message: duplicate_result.message });
    else if (duplicate_result.isServerError)
        return result.status(500).json({ message: duplicate_result.message });

    const register_result = await registerService.createAccount(
        username,
        password,
        email
    );
    if (!register_result.success)
        return result
            .status(register_result.isServerError ? 500 : 400)
            .json({ message: register_result.message });

    return result.status(201).json({
        message: 'Successfully registered the account.',
    });
});

module.exports = router;
