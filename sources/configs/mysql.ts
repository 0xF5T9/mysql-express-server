/**
 * @file mysql.ts
 * @description MySQL Server configuration.
 */

'use strict';
import mysql from 'mysql2/promise';

const mysqlConfig: {
    pool: mysql.Pool;
    poolOptions: mysql.PoolOptions;
    readonly defaultPagination: number;
} = {
    pool: null,
    poolOptions: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectTimeout: 60000,
        waitForConnections: true,
        connectionLimit: 100,
        maxIdle: 100,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
    },
    defaultPagination: 10,
};

export default mysqlConfig;
