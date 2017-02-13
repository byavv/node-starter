'use strict';

/**
 * Module default controller
 */
module.exports = function (app) {
    const movie = app.locals.models.movie;
    // to have services in your controller:
    // const someservice = app.locals.services.someservice

    return {

        /**
         * Create new movie
         * /POST /movies
         */
        create(req, res, next) {
            movie.create(req.body, function (err, movieInst) {
                if (err) return next(err);
                res.json(movieInst);
            })
        },

        /**
         * Get all movies with filter
         * GET /movies
         */
        find(req, res, next) {
            movie.find(req.filter, (err, result) => {
                if (err) return next(err);
                res.json({ movies: result });
            });
        },

        /**
         * Find movie by id
         * GET /movies/{id}
         */
        findById(req, res, next) {
            movie.findById(req.params['id'], (err, result) => {
                res.json({ movie: result });
            })
        },

        /**
        * Find one movie by filter
        * GET /movies/findOne?where[title][$eq]=title
        * or GET /api/v1/movies/?where[meta.votes][$gt]=5
        * https://docs.mongodb.com/manual/reference/operator/query/
        */
        findOne(req, res, next) {
            movie.findOne(req.filter, (err, result) => {
                res.json(result);
            })
        },

        /**
         * PUT /movies/{id}
         * Update existing movie
         */
        update(req, res, next) {
            const id = req.params['id'];
            movie.findOneAndUpdate({ id: id }, req.body, (err, result) => {
                if (err) return next(err);
                res.json(result)
            });
        },

        /**
         *  DELETE /movies/{id} operationId
         */
        remove(req, res, next) {
            const id = req.params['id'];
            movie.findOneAndRemove({ id: id }, req.body, (err, result) => {
                if (err) return next(err);
                res.json(result)
            });
        }
    }
}
