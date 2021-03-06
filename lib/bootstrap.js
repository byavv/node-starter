'use strict';
const path = require("path")
    , fs = require("fs")
    , mongoose = require("mongoose")
    , chalk = require('chalk')
    , glob = require("glob")
    , ModuleBase = require('./').ModuleBase
    ;

function init(app, configFileName = 'config.json') {
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
        resolve(config);
    });
}

function buildModules(app, config, services) {
    const modules = {};
    return new Promise((resolve, reject) => {
        config.modules.forEach((modulePath) => {
            try {
                let moduleConfigPath = path.resolve(app.get('root'), modulePath, 'module.json');
                let moduleConfig = require(moduleConfigPath);
                let schemePath = path.resolve(app.get('root'), modulePath, moduleConfig.model);
                let routesPath = path.resolve(app.get('root'), modulePath, moduleConfig.routes);
                let moduleContext = new ModuleBase();
                moduleContext.services = services;
                moduleContext.app = app;
                let schema = require(schemePath)(moduleContext);
                let model = mongoose.model(moduleConfig.name, schema);
                moduleContext.model = model;
                Reflect.set(modules, moduleConfig.name, moduleContext);
                let router = require(routesPath)(moduleContext);
                app.use(`${config.base}${moduleConfig.path}`, router);
                console.log(chalk.cyan(`Created router for ${moduleConfig.name} on ${config.base}${moduleConfig.path}`));

            } catch (error) {
                console.log(chalk.bgRed(`Error when building module for: ${modulePath} module`));
                throw new Error(error);
            }
        });
        resolve(modules);
    });
}

function runServices(app, config) {
    let services = {};
    let runAll_q = config.services
        .reduce((servicesRunAggregator, service, index) => {
            try {
                let servicePath = path.resolve(app.get('root'), service.path);
                let serviceConfig = require(path.resolve(servicePath, 'service.json'));
                let serviceFilePath = path.resolve(servicePath, serviceConfig.main);
                let Cls = require(serviceFilePath);
                let serviceInst = Reflect.construct(Cls, [app, Object.assign(serviceConfig.defaults, service.config)]);
                servicesRunAggregator.push(serviceInst.run());
                Reflect.set(services, serviceConfig.name, serviceInst);
                return servicesRunAggregator;
            } catch (error) {
                console.log(chalk.bgRed(`Error when trying to run ${service.path} service`));
                throw new Error(error);
            }
        }, []);
    return Promise.all(runAll_q).then(() => services);
}

function bootScripts(app) {
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

/* jshint ignore:start */

module.exports = async function load(app, configFileName) {
    const config = await init(app, configFileName);
    const services = await runServices(app, config);
    const modules = await buildModules(app, config, services);
    await bootScripts(app);
    return modules;
}
/* jshint ignore:end */