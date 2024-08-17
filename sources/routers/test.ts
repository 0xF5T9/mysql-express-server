/**
 * @file test.ts
 * @description Test router.
 */

'use strict';
import express from 'express';
import controller from '../controllers/test';

const router = express.Router();

// Get test posts.
router.get('/posts', controller.getTestPosts);

export default router;
