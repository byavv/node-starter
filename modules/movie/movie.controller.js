/*jshint -W116*/
'use strict';

const controllerFactory = require('../../lib').factory;

/**
 * Module default controller
 */
function movieController(movieModule) {
    let movie = movieModule.model
        , app = movieModule.app
        ;

    app.on('loaded', () => {
        // do something when app started
    });

    let controller = {

        // Define custom methods here
        // Or override methods from base controller

        custom(req, res, next) {
            res.json({ result: 'OK' });
        }
    };

    return controllerFactory(movie, controller);
}

module.exports = movieController;

