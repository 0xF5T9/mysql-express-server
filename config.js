/**
 * @file config.js
 * @description Server configuration.
 */

'use strict';

const config = {
    database: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectTimeout: 60000,
    },
    itemPerPage: 10,
};

module.exports = config;
