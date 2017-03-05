const express = require('express')
    , load = require('../lib/bootstrap')
    , path = require("path")
    , app = require('../')
    ;

// todo: start server only for particular module, not all of them
module.exports = function (moduleName, clb) {
    if (!moduleName) throw Error("no module name defined");
    app.set("root", path.resolve('..', __dirname));
    app.set('views', path.join(__dirname, '../', 'views'));
    app.set('view engine', 'jade');
    load(app, 'testConfig.json').then((modules) => {
        app.listen(3656, () => {
            clb(null, modules[moduleName]);
            app.emit('loaded');
        });
    }).catch((error) => {
        console.error(error);
        clb(error);
    });
}
