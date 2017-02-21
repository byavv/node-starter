"use strict";

const controller = require('./movie.controller')
    , express = require('express')
    , middleware = require('../../middleware')
    ;

module.exports = function (movieModule) {
    const ctr = controller(movieModule)
        , app = movieModule.app
        , router = express.Router()
        , mongoService = movieModule.services.mongo
        ;

    router.get('/'
        , middleware.mongoStatus(mongoService)
        , middleware.queryFilter, ctr.find);
    router.post('/', ctr.create);
    router.get('/findOne', middleware.queryFilter, ctr.findOne);
    router.get('/custom', ctr.custom);
    router.get('/:id', ctr.findById);
    router.put('/:id', ctr.update);
    router.delete('/:id', ctr.remove);

    // ...
    return router;
};