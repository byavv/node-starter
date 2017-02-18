"use strict";

const EventEmitter = require('events');

class ServiceBase extends EventEmitter {
    constructor() {
        super();
    }
    run() {
        throw new Error("Service doesn't provide run method");
    }
    stop() {
        console.log("Service stop is not implemented");
    }
}

module.exports = ServiceBase;
