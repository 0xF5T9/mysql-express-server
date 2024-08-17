/**
 * @file authorize.ts
 * @description Authorize router.
 */

'use strict';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/authorize';

const router = express.Router();

const authorizeLimiter = rateLimit({
    // 10 requests per 1 minutes.
    windowMs: 1 * 60 * 1000,
    limit: 10,
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
});

// Authenticate a user and return a JSON Web Token (JWT) upon success.
router.post('/', authorizeLimiter, controller.authorize);

// Verify user token.
router.post('/verifyToken', controller.verifyToken);

export default router;
