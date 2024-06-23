/**
 * @file test.js
 * @description Test router.
 */

'use strict';
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/test');

// Get test posts.
router.get('/posts', controller.getTestPosts);

module.exports = router;
