/**
 * @file helper.js
 * @description Helper functions.
 */

'use strict';

/**
 * Calculates the offset for pagination based
 * on the current page and items per page.
 * @param {Number} currentPage Current page.
 * @param {Number} itemPerPage Item per page.
 * @returns {Number} The calculated offset for pagination.
 */
function getOffset(currentPage = 1, itemPerPage) {
    return (currentPage - 1) * itemPerPage;
}

/**
 * Check if a string is a valid date format string. (yyyy-mm-dd)
 * @param {String} stringDate Date string.
 * @returns {Boolean}  Returns true if the string is a valid date format string, otherwise returns false.
 */
function isValidDate(stringDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(stringDate)) {
        return false;
    }

    const [year, month, day] = stringDate.split('-').map(Number),
        date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

module.exports = {
    getOffset,
    isValidDate,
};
