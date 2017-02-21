"use strict";

const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

let schemaFactory = function (movieModule) {
    const sseService = movieModule.services.sse
        ;

    var movieSchema = new Schema({
        title: String,
        author: String,
        body: String,
        comments: [{ body: String, date: Date }],
        hidden: Boolean,
        meta: {
            votes: Number,
            favs: Number
        }
    });

    // for example
    movieSchema.post('save', function (doc) {
        if (sseService) {
            sseService.send(doc);
        }
    });
    movieSchema.post('find', function (result) {
        if (sseService) {
            sseService.send(result);
        }
    });

    return movieSchema;
};

module.exports = schemaFactory;