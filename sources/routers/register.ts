/**
 * @file register.ts
 * @description Register router.
 */

'use strict';
import express from 'express';
import controller from '../controllers/register';

const router = express.Router();

// Register account.
router.post('/', controller.register);

export default router;
