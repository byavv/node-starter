const express = require('express')
    //, router = express.Router();

module.exports = function (app) {
    // router.get('*', (req, res) => {
    //     res.render('index');
    // });
    // app.use(router)
    app.use(express.static('client'));
}