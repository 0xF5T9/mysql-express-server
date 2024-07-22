/**
 * @file server.js
 * @description Start the MySQL Server using Express.
 */

'use strict';

// External module(s).
const dotenv = require('dotenv'); // Loads environment variables from the .env file into process.env
dotenv.config({
    path: '.env',
}); // https://stackoverflow.com/questions/44915758/node-process-env-variable-name-returning-undefined

const express = require('express'),
    { rateLimit } = require('express-rate-limit'),
    cors = require('cors');

// Global rate limiter.
const limiter = rateLimit({
    // 300 requests per 15 minutes.
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Express configurations.
const app = express();
app.set('trust proxy', 1); // Trust nginx proxy so rate limiter won't complaint.
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Initialize routers.
const routers = require('../sources/routers');
routers(app);

// Initialize mysql.
const {
    initialize: mysql_initialize,
} = require('../sources/services/database');
mysql_initialize();

// Error-handling middleware.
app.use((error, request, result, next) => {
    console.error(
        `THIS ERROR IS CAPTURED BY THE DEFAULT ERROR-HANDLING MIDDLEWARE.\n`,
        error
    );
    result.status(error.status || 500).json({ message: error.message });
});

// Launch server.
const port = 1284;
app.listen(port, () => {
    console.log(`MySQL Server started on port ${port} using following parameters:\n
MYSQL_HOST=${process.env.MYSQL_HOST}
MYSQL_USER=${process.env.MYSQL_USER}
MYSQL_PASSWORD=${process.env.MYSQL_PASSWORD}
MYSQL_DATABASE=${process.env.MYSQL_DATABASE}
SECRET_KEY=${process.env.SECRET_KEY}
NODE_ENV=${process.env.NODE_ENV}\n`);
    console.log(`MySQL Server is listening on port ${port}.`);
});
