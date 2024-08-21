/**
 * @file server.ts
 * @description Start the backend web-server using Express.
 */

'use strict';
import dotenv from 'dotenv';
dotenv.config({
    path: '.env',
});

import express, { ErrorRequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import routers from '../sources/routers';
import { initialize as mysqlInitialize } from '../sources/services/database';
import expressConfig from '../configs/express.json';

const app = express();

// Trust proxy: If this server is meant to be run behind a proxy,
// set the trust level accordingly so the rate limiter won't complaint.
app.set('trust proxy', 1);

// Global rate limiter configurations.
const limiter = rateLimit({
    // 300 requests per 1 minutes.
    windowMs: 1 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limiter);

// Cors configurations.
app.use(cors());

// Other express configurations.
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Initialize routers.
routers(app);

// Initialize mysql.
mysqlInitialize();

// Error-handling middleware.
const errorHandler: ErrorRequestHandler = function (
    error,
    request,
    response,
    next
) {
    console.error(error);
    response.status(500).json({ message: 'Unexpected server error occurred.' });
};
app.use(errorHandler);

// Launch server.
app.listen(expressConfig.port, () => {
    console.log(`Application is listening on port ${expressConfig.port}.`);
});
