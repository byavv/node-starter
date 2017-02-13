const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

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
module.exports = movieSchema;