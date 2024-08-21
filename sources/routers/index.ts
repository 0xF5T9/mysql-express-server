/**
 * @file index.ts
 * @description Server routers.
 */

import { Express, Request, Response } from 'express';
import authorizeRouter from './authorize';
import registerRouter from './register';
import userRouter from './user';
import recoveryRouter from './recovery';
import testRouter from './test';

/**
 * Initialize the server routers.
 * @param Express instance.
 */
function routers(app: Express) {
    app.use('/authorize', authorizeRouter);
    app.use('/register', registerRouter);
    app.use('/user', userRouter);
    app.use('/recovery', recoveryRouter);
    app.use('/test', testRouter);
    app.get('/', (request: Request, response: Response) => {
        return response.status(200).json({ message: 'Ok.' });
    });
}

export default routers;
