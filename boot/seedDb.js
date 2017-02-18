"use strict";
const express = require('express')
    , router = express.Router();

module.exports = function (app) {
    return new Promise((resolve, reject) => {
        // check db if you need here
        resolve();
    });
};