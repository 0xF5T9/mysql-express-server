/**
 * @file test.ts
 * @description Test router.
 */

'use strict';
import express from 'express';
import controller from '../controllers/test';

const router = express.Router();

router.get('/posts', controller.getTestPosts); // Get test posts.
router.post('/sendMail', controller.sendMail); // Send email using nodemailer.

export default router;
