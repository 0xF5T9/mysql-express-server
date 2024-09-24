/**
 * @file test.ts
 * @description Test router models.
 */

'use strict';
import nodemailer from 'nodemailer';
import { query } from '../services/database';
import { ModelError, ModelResponse, getOffset } from '../utility/model';
import mysqlConfig from '../../configs/mysql.json';

/**
 * Get the posts.
 * @param page Pagination.
 * @param itemPerPage Item per page.
 * @returns Returns the response object.
 */
async function getPosts(page: number = 1, itemPerPage: number = 12) {
    try {
        const offset = getOffset(page, itemPerPage);

        const itemsQueryResult = await query(
                `SELECT title, text FROM posts LIMIT ?, ?`,
                [`${offset}`, `${itemPerPage}`]
            ),
            posts = itemsQueryResult || [];

        const totalItemsQueryResult = await query(
                `SELECT COUNT(*) AS total_items from posts`
            ),
            totalPosts = (totalItemsQueryResult as any[])[0].total_items;

        const prevPage = Math.max(1, page - 1),
            nextPage = Math.max(
                1,
                Math.min(Math.ceil(totalPosts / itemPerPage), page + 1)
            );

        const meta = {
            page,
            itemPerPage,
            totalItems: totalPosts,
            isFirstPage: page === 1,
            isLastPage: page === nextPage,
            prevPage: `/test/posts?page=${prevPage}&itemPerPage=${itemPerPage}`,
            nextPage: `/test/posts?page=${nextPage}&itemPerPage=${itemPerPage}`,
        };

        return new ModelResponse('Successfully retrieved the data.', true, {
            meta,
            posts,
        });
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new ModelResponse(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError,
            error.statusCode
        );
    }
}

/**
 * Send email using nodemailer.
 * @param transporterOptions Nodemailer transporter options.
 * @param mailOptions Nodemailer mail options.
 * @returns Returns the response object.
 */
async function sendMail(
    transporterOptions: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        service?: string;
    },
    mailOptions: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }
) {
    try {
        const transporter = nodemailer.createTransport({
            service: transporterOptions.service,
            host: transporterOptions.host,
            port: transporterOptions.port,
            secure: transporterOptions.secure,
            auth: {
                user: transporterOptions.user,
                pass: transporterOptions.password,
            },
            // tls: { servername: `${transporterOptions.host}`, rejectUnauthorized: false },
            // ignoreTLS: true,
        });

        const sendMailResult = await transporter.sendMail({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });

        return new ModelResponse('Successfully.', true, sendMailResult);
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new ModelResponse(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError,
            error.statusCode
        );
    }
}

export default { getPosts, sendMail };
