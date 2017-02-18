'use strict';
const path = require("path")
    , fs = require("fs")
    , mongoose = require("mongoose")
    , chalk = require('chalk')
    , glob = require("glob")
    ;

module.exports = {
    applyConfig(app, configFileName = 'config.json') {
        return new Promise((resolve, reject) => {
            let configPath = path.resolve(app.get('root'), configFileName);
            if (!fs.existsSync(configPath)) {
                reject(`No configuration file found at ${configPath}`);
            }
            let config;
            try {
                config = require(path.resolve(app.get('root'), configFileName));
            } catch (err) {
                reject('Configuration file has unexpexted format');
            }
            if ((!config.services || !Array.isArray(config.services))) {
                reject('Configuration has wrong format, services field missed');
            }
            if ((!config.modules || !Array.isArray(config.modules))) {
                reject('Configuration has wrong format, modules field missed');
            }
            if (!fs.existsSync(path.resolve(app.get('root'), 'boot')) && process.env.NODE_ENV !== 'test') {
                reject(`No boot directory found at ${path.resolve(app.get('root'))}. This folder is required`);
            }
            app.set('config', config);
            Reflect.set(app.locals, 'services', {});
            Reflect.set(app.locals, 'models', {});
            resolve();
        });
    },
    applyModels(app) {
        let config = app.get('config');
        return new Promise((resolve, reject) => {
            config.modules.forEach((modulePath) => {
                try {
                    let moduleConfigPath = path.resolve(app.get('root'), modulePath, 'module.json');
                    let moduleConfig = require(moduleConfigPath);
                    let schemePath = path.resolve(app.get('root'), modulePath, moduleConfig.model);
                    let schema = require(schemePath);
                    let model = mongoose.model(moduleConfig.name, schema);                   
                    Reflect.set(app.locals.models, moduleConfig.name, model);
                } catch (error) {
                    console.log(chalk.bgRed(`Error when configuring mongo and models for: ${modulePath} module`));
                    throw error;
                }
            });
            resolve();
        });
    },
    runServices(app) {
        let config = app.get('config');
        let runAll_q = config.services
            .reduce((servicesRunAggregator, service, index) => {
                try {
                    let servicePath = path.resolve(app.get('root'), service.path);
                    let serviceConfig = require(path.resolve(servicePath, 'service.json'));
                    let serviceFilePath = path.resolve(servicePath, serviceConfig.main);
                    let Cls = require(serviceFilePath);
                    let serviceInst = Reflect.construct(Cls, [app, Object.assign(serviceConfig.defaults, service.config)]);
                    servicesRunAggregator.push(serviceInst.run());
                    Reflect.set(app.locals.services, serviceConfig.name, serviceInst);
                    return servicesRunAggregator;
                } catch (error) {
                    console.log(chalk.bgRed(`Error when trying to run ${service.path} service`));
                    throw error;
                }
            }, []);
        return Promise.all(runAll_q);
    },
    applyRoutes(app) {
        let config = app.get('config');
        return new Promise((resolve, reject) => {
            config.modules.forEach((modulePath) => {
                try {
                    let moduleConfigPath = path.resolve(app.get('root'), modulePath, 'module.json');
                    let moduleConfig = require(moduleConfigPath);
                    let routesPath = path.resolve(app.get('root'), modulePath, moduleConfig.routes);
                    let router = require(routesPath)(app);
                    app.use(`${config.base}${moduleConfig.path}`, router);
                    console.log(chalk.cyan(`Created router for ${moduleConfig.name} on ${config.base}${moduleConfig.path}`));
                } catch (error) {
                    console.log(chalk.bgRed(`Error when building router for: ${modulePath} module`));
                    throw error;
                }
            });
            resolve();
        });
    },
    bootScripts(app) {
        let bootAll_q = [];
        if (fs.existsSync(path.resolve(app.get('root'), 'boot'))) {
            glob(`${app.get('root')}/boot/**/*.js`, {}, (er, files) => {
                files.forEach((file) => {
                    bootAll_q.push(require(path.resolve(app.get('root'), 'boot', file))(app));
                });
            });
            return Promise.all(bootAll_q);
        }
    }
};
