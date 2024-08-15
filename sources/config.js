/**
 * @file config.js
 * @description Server configuration.
 */

'use strict';

const config = {
    connection: null,
    database: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        waitForConnections: true,
        connectionLimit: 100,
        maxIdle: 100,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
    },
    itemPerPage: 10,
};

module.exports = config;
