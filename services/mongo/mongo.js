"use strict";

const chalk = require('chalk')
    , mongoose = require('mongoose')
    , ServiceBase = require('../../lib').ServiceBase
    ;

class MongoService extends ServiceBase {
    constructor(app, config) {
        super();
        Object.assign(this, { app, config });
    }
    run() {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.config.connectionString, this.config.options);
            this.db = mongoose.connection;
            this.db.on("error", (err) => {
                console.error(chalk.red("MongoDB connection crushed!"));
                reject(err);
            });
            this.db.on("disconnecting", () => {
                console.info("Disconnected from MongoDB.");
            });
            this.db.on("connected", () => {
                console.log(chalk.green("Connected to MongoDB..."));
                resolve();
            });
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            mongoose.disconnect(err => {
                err ? reject(err) : resolve();
            });
        });
    }
    getConnection() {
        return this.db;
    }
}
module.exports = MongoService;