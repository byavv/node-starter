const express = require('express')
    , bs = require('../lib/bootstrap')
    , path = require("path")
    , app = require('../')
    ;


function load(app) {
    app.set('views', path.join(__dirname, '../', 'views'));
    app.set('view engine', 'jade');
    return bs.applyConfig(app, "testConfig.json")
        .then(() => bs.applyModels(app))
        .then(() => bs.runServices(app))
        .then(() => bs.applyRoutes(app))
        .then(() => bs.bootScripts(app))
}

module.exports = function (clb) {
    app.set("root", path.resolve('..', __dirname));
    load(app).then(() => {
        app.listen(3656, () => {
            clb(null, app);
        });
    }).catch((error) => {
        console.error(error);
        clb(error)
    })
}