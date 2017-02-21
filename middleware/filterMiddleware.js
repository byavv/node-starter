"use strict";

module.exports = function (req, res, next) {
    let filter = req.query.where || {};
    req.filter = filter;
    next();
};
