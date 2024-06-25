/**
 * @file test.js
 * @description Test router models.
 */

'use strict';
const database = require('../services/database'),
    { itemPerPage } = require('../config'),
    {
        ModelError: Error,
        ModelResponse: Response,
        getOffset,
    } = require('../utility/model');

/**
 * Get the posts.
 * @param {Number=} [page=1] Pagination.
 * @returns {Promise<ModelResponse>} Returns the response object.
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

        return new Response('Successfully retrieved the posts data.', true, {
            posts,
            meta,
        });
    } catch (error) {
        console.error(error);
        if (error.isServerError === undefined) error.isServerError = true;

        return new Response(
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

module.exports = {
    getPosts,
};
