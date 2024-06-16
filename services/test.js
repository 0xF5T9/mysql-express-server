/**
 * @file test.js
 * @description Test services.
 */

'use strict';
const database = require('./database'),
    { itemPerPage } = require('../config'),
    {
        ServiceError: Error,
        ServiceResult: Result,
        getOffset,
    } = require('../utility/services');

/**
 * Get the posts.
 * @param {Number} [page=1] Pagination.
 * @returns {Result} Returns the result object.
 */
async function getPosts(page = 1) {
    try {
        page = parseInt(page);
        if (!page) page = 1;

        const offset = getOffset(page, itemPerPage),
            sql = `SELECT title, text FROM posts LIMIT ?, ?`;

        const result = await database.query(sql, [
            `${offset}`,
            `${itemPerPage}`,
        ]);

        const posts = result || [],
            meta = { page, totalPosts: result.length };

        return new Result('Successfully retrieved the posts data.', true, {
            posts,
            meta,
        });
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Result(
            error.isServerError === false
                ? error.message
                : 'Unexpected server error has occurred.',
            false,
            null,
            error.isServerError
        );
    }
}

module.exports = {
    getPosts,
};
