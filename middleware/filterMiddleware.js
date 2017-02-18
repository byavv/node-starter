"use strict";

module.exports = function filterObjectMiddlewareFactory(app) {
    return function (req, res, next) {
        let filter = req.query.where || {};
        req.filter = filter;
        next();
    };
};