/**
 * @file database.js
 * @description Database query services.
 * @note Should be only used by route services
 *       and not to be exposed directly to public endpoint.
 */

'use strict';
const mysql = require('mysql2/promise'),
    config = require('../config');

/**
 * Executes a SQL query with optional parameters.
 * @param {String} sql - The SQL query to execute.
 * @param {Array=} params - An optional array of parameters to bind to the query.
 * @returns {Promise<*>} A promise resolving to an array of query results.
 */
async function query(sql, params) {
    const connection = await mysql.createConnection(config.database),
        [results] = await connection.execute(sql, params);
    return results;
}

module.exports = {
    query,
};
