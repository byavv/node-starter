"use strict";

const EventEmitter = require('events');

class ModuleBase extends EventEmitter {
    constructor() {
        super();
        Object.assign(this, {});
    }
}

module.exports = ModuleBase;
