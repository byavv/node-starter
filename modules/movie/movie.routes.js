"use strict";

const controller = require('./movie.controller')
    , express = require('express')
    , middleware = require('../../middleware')
    ;

module.exports = function (app) {
    const ctr = controller(app);
    const router = express.Router();

    router.get('/'
        , middleware.mongoStatus(app)
        , middleware.queryFilter(app), ctr.find);
    router.post('/', ctr.create);
    router.get('/findOne', middleware.queryFilter(app), ctr.findOne);
    router.get('/:id', ctr.findById);
    router.put('/:id', ctr.update);
    router.delete('/:id', ctr.remove);

    // ...
    return router;
};