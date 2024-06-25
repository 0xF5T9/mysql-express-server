/**
 * @file model.js
 * @description Utility classes and functions used by models.
 */

'use strict';

/**
 * Model error object.
 */
class ModelError extends Error {
    /**
     * Constructs a model error object.
     * @param {String} [message=''] Error message.
     * @param {Boolean=} [isServerError=false] Specifies whether a server error has occurred.
     * @param {Number=} [statusCode=undefined] Specifies a specific http status code for the error.
     * @returns {Object} Returns the error object.
     */
    constructor(message = '', isServerError = false, statusCode = undefined) {
        super(message);
        this.message = message;
        this.isServerError = isServerError;
        this.statusCode = statusCode;
    }
}

/**
 * Model response object.
 */
class ModelResponse {
    /**
     * Constructs a model response object.
     * @param {String} [message=''] Response message.
     * @param {Boolean} [success=false] Specifies whether the action is successful.
     * @param {Object=} [data=null] Response associated data.
     * @param {Boolean=} [isServerError=false] Specifies whether a server error has occurred.
     * @param {Number=} [statusCode=undefined] Specifies a specific http status code.
     *                                         If not specified, it will be automatically filled in.
     * @returns {Object} Returns the response object.
     */
    constructor(
        message = '',
        success = false,
        data = null,
        isServerError = false,
        statusCode = undefined
    ) {
        this.message = message;
        this.success = success;
        this.data = data;
        this.isServerError = isServerError;
        this.statusCode = statusCode
            ? statusCode
            : isServerError
              ? 500
              : success
                ? 200
                : 400;
    }
}

/**
 * Calculates the offset for pagination based
 * on the current page and items per page.
 * @param {Number} [currentPage=1] Current page.
 * @param {Number} itemPerPage Item per page.
 * @returns {Number} The calculated offset for pagination.
 */
function getOffset(currentPage = 1, itemPerPage) {
    return (currentPage - 1) * itemPerPage;
}

/**
 * Check if a string is a valid date format string. (yyyy-mm-dd)
 * @param {String} stringDate Date string.
 * @returns {Boolean} Returns true if the string is a valid date format string, otherwise returns false.
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
    ModelError,
    ModelResponse,
    getOffset,
    isValidDate,
};
