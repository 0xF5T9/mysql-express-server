/**
 * @file index.js
 * @description Server routers.
 */

const authorizeRouter = require('./authorize'),
    registerRouter = require('./register'),
    userRouter = require('./user'),
    testRouter = require('./test');

/**
 * Initialize the server routers.
 * @param {*} app Express instance.
 */
function routers(app) {
    app.use('/authorize', authorizeRouter);
    app.use('/register', registerRouter);
    app.use('/user', userRouter);
    app.use('/test', testRouter);
    app.get('/', (request, response) => {
        return response.status(200).json({ message: 'Ok.' });
    });
}

module.exports = routers;
