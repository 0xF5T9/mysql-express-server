/**
 * @file database.ts
 * @description Database services used by models.
 */

'use strict';
import mysql from 'mysql2/promise';
import mysqlConfig from '../configs/mysql';

/**
 * Initialize mysql server.
 */
async function initialize() {
    mysqlConfig.pool = await mysql.createPool(mysqlConfig.poolOptions);
}

/**
 * Executes a SQL query with optional parameters.
 * @param sql The SQL query to execute.
 * @param params An optional array of parameters to bind to the query.
 * @returns A promise resolving to an array of query results.
 */
async function query(sql: string, params?: string[]) {
    const [results] = await mysqlConfig.pool.execute(sql, params);
    return results;
}

export { initialize, query };
