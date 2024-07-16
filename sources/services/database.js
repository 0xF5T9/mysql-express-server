/**
 * @file database.js
 * @description Database services used by models.
 */

'use strict';
const mysql = require('mysql2/promise'),
    config = require('../config');

async function initialize() {
    config.connection = await mysql.createConnection(config.database);
}

/**
 * Executes a SQL query with optional parameters.
 * @param {String} sql - The SQL query to execute.
 * @param {Array=} params - An optional array of parameters to bind to the query.
 * @returns {Promise<*>} A promise resolving to an array of query results.
 */
async function query(sql, params) {
    const [results] = await config.connection.execute(sql, params);
    return results;
}

module.exports = {
    initialize,
    query,
};
