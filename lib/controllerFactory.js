"use strict";
/**
 * Base class for all controllers 
 * Provides base CRUD operations
 */
function controllerBase(model) {
    let name = model.name;
    return {
        /**
         * Create new model
         * POST /models
         */
        create(req, res, next) {
            model.create(req.body, function (err, result) {
                if (err) { return next(err); }
                res.json(result);
            });
        },

        /**
         * Get all models with filter
         * GET /models
         */
        find(req, res, next) {
            model.find(req.filter, (err, result) => {
                if (err) { return next(err); }
                res.json(result);
            });
        },

        /**
         * Find model by id
         * GET /models/{id}
         */
        findById(req, res, next) {
            model.findById(req.params.id, (err, result) => {
                res.json(result);
            });
        },

        /**
         * Find one model by filter
         * GET /models/findOne?where[title][$eq]=title
         * or GET /api/v1/models/?where[meta.votes][$gt]=5
         * https://docs.mongodb.com/manual/reference/operator/query/
         */
        findOne(req, res, next) {
            model.findOne(req.filter, (err, result) => {
                res.json(result);
            });
        },

        /**
         * PUT /models/{id}
         * Update existing model
         */
        update(req, res, next) {
            const id = req.params.id;
            model.findOneAndUpdate({ id: id }, req.body, (err, result) => {
                if (err) { return next(err); }
                res.json(result);
            });
        },

        /**
         *  DELETE /models/{id} operationId
         */
        remove(req, res, next) {
            const id = req.params.id;
            model.findOneAndRemove({ id: id }, req.body, (err, result) => {
                if (err) { return next(err); }
                res.json(result);
            });
        }
    };
}

function controllerFactory(model, ctr) {
    const controllerBaseInst = controllerBase(model);
    return Object.assign(Object.create(controllerBaseInst), ctr);
}

module.exports = controllerFactory;