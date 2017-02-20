"use strict";

const chalk = require('chalk')
    , mongoose = require('mongoose')
    , ServiceBase = require('../../lib').ServiceBase
    , SSEClient = require('./sseClient')
    ;

class SseService extends ServiceBase {

    constructor(app, config) {
        super();
        Object.assign(this, { app, config });
        this.connections = [];
    }
    run() {
        console.log(chalk.green("Sse service is running..."));
        this.app.all(this.config.url || '/sse', (req, res) => {
            if (req.headers.accept && req.headers.accept === 'text/event-stream') {
                this.initClient(req, res);
            } else {
                res.status(503);
                res.end();
            }
        });
    }
    initClient(req, res) {
        var client = new SSEClient(req, res);
        client.initialize();
        client.on('close', () => {
            var index = this.connections.indexOf(client);
            if (index > 0) {
                this.connections.splice(index, 1);
            }
        });
        this.connections.push(client);
    }
    send(data) {
        this.connections.forEach((client) => {
            client.send(JSON.stringify(data));
        });
    }
    stop() {
        this.connections.forEach((client) => {
            client.close();
        });
    }
}
module.exports = SseService;