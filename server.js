/**
 * @file server.js
 * @description Start the MySQL Server using Express.
 */

'use strict';

// External module(s).
const dotenv = require('dotenv'); // Loads environment variables from the .env file into process.env
dotenv.config({ path: './.env' }); // https://stackoverflow.com/questions/44915758/node-process-env-variable-name-returning-undefined
const express = require('express'),
    cors = require('cors');

// Express configurations.
const app = express();
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Routes (Endpoints):
const authorizationRouter = require('./routes/authorization'),
    registerRouter = require('./routes/register'),
    userRouter = require('./routes/user'),
    testRouter = require('./routes/test');
app.get('/', (request, result) => {
    return result.status(200).json({ message: 'ok' });
});
app.use('/authorize', authorizationRouter);
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/test', testRouter);

// Error-handling middleware.
app.use((error, request, result, next) => {
    console.error(
        'THIS ERROR IS CAPTURED BY SPECIAL ERROR-HANDLING MIDDLEWARE.'
    );
    const status_code = error.statusCode || 500;
    console.error(error.message, error.stack);
    result.status(status_code).json({ message: error.message });
});

// Launch server.
const port = 1284;
app.listen(port, () => {
    console.log(`MySQL Server is listening on port ${port}.`);
});
