/**
 * @file recovery.ts
 * @description Recovery router.
 */

'use strict';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/recovery';

const router = express.Router();

const recoveryLimiter = rateLimit({
    // 1 requests per 3 hours.
    windowMs: 180 * 60 * 1000,
    limit: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: true,
    message: 'Please try again later.',
    handler: (
        request: Request,
        response: Response,
        next: NextFunction,
        options: any
    ) => {
        return response
            .status(429)
            .json({ message: 'Please try again later.' });
    },
    keyGenerator: (request: Request, response: Response) => request.body.email,
});

router.post('/forgot-password', recoveryLimiter, controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

export default router;
