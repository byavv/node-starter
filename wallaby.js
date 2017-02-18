"use strict";

module.exports = function () {
    process.env.NODE_ENV = 'test';

    return {
        files: [
            'index.js',
            'lib/**/*.js',
            'boot/**/*.js',
            'middleware/**/*.js',
            'modules/**/*.js',
            'test/**/*.js',
            { pattern: 'modules/**/*.spec.js', ignore: true },
            { pattern: 'test/**/*.spec.js', ignore: true }
        ],
        setup: function () {
            global.expect = require('chai').expect;
        },
        tests: [
            'test/**/*.spec.js',
            'modules/**/*.spec.js'
        ],
        env: {
            type: 'node',
            params: {
                runner: '--harmony'
            }
        },
        testFramework: 'mocha'
    };
};