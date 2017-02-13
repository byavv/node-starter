const queryFilter = require('./filterMiddleware')
    , mongoStatus = require('./mongoStatusMiddleware')
    ;
module.exports = { queryFilter, mongoStatus }