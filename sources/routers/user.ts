/**
 * @file user.ts
 * @description User router.
 */

'use strict';
import express from 'express';
import controller from '../controllers/user';
import authorizeModel from '../models/authorize';

const router = express.Router();

// Get user information.
router.get(
    '/:username',
    authorizeModel.authenticateUsername,
    controller.getInfo
);

export default router;
