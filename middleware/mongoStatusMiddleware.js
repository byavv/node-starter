"use strict";

module.exports = function mongoStatusMiddlewareFactory(app) {
    const mongoService = app.locals.services.mongo;
    return function (req, res, next) {
        if (process.env.NODE_ENV !== 'test' && !mongoService.getConnection().readyState) {
            res.set('Retry-After', 5);
            return res.status(503).end();
        }
        next();
    };
};