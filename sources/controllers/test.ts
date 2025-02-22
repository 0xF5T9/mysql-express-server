/**
 * @file test.ts
 * @description Test router controller.
 */

'use strict';
import { RequestHandler } from 'express';
import model from '../models/test';

/**
 * Test router controller.
 */
class TestController {
    // [GET] /test/posts
    getTestPosts: RequestHandler = async (request, response, next) => {
        const query: { page?: string; itemPerPage?: string } = {
                ...request.query,
            },
            page = parseInt(query.page),
            itemPerPage = parseInt(query.itemPerPage);

        const postsResult = await model.getPosts(
            page || undefined,
            itemPerPage || undefined
        );
        if (!postsResult.success)
            return response.status(postsResult.statusCode).json({
                message: postsResult.message,
            });

        return response.status(postsResult.statusCode).json({
            message: postsResult.message,
            data: postsResult.data,
        });
    };

    // [POST] /test/sendMail
    // --- [Example body] ---
    // host:smtp.gmail.com
    // port:465
    // secure:1
    // user:my@gmail.com
    // password:my-app-password
    // service:gmail
    // from:no-reply <my@gmail.com>
    // to:someCustomer@gmail.com
    // subject:Test email sent by nodemailer
    // html:<h1>This is a test</h1>
    sendMail: RequestHandler = async (request, response, next) => {
        // Transform
        const transporterOptions = {
                host: request.body.host,
                port: parseInt(request.body.port),
                secure: !!parseInt(request.body.secure),
                user: request.body.user,
                password: request.body.password,
                service: request.body.service,
            },
            mailOptions = {
                from: request.body.from,
                to: request.body.to,
                subject: request.body.subject,
                html: request.body.html,
            };

        const result = await model.sendMail(transporterOptions, mailOptions);
        if (!result.success)
            return response
                .status(result.statusCode)
                .json({ message: result.message });

        return response
            .status(200)
            .json({ message: 'Successfully.', data: result.data });
    };
}

export default new TestController();
