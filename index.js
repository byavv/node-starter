"use strict";
const http = require('http')
    , express = require('express')
    , program = require('commander')
    , bs = require('./lib/bootstrap')
    , chalk = require('chalk')
    , fs = require('fs')
    , path = require('path')
    , helmet = require('helmet')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , morgan = require('morgan')
    , errorHandler = require('strong-error-handler')
    , cors = require('cors')
    ;

program
    .version('0.0.1')
    .option('-p, --port [value]', 'Set execution port number', parseInt)
    .option('-c, --config [value]', 'Set bootstrap configuration file location', process.cwd())
    .option('-e, --environment [value]', 'Define environment', /^(development|production|test)$/i, 'development')
    .parse(process.argv);

let app = module.exports = express();
let port = program.port || 3005;
process.env.NODE_ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : program.environment;

app.set("port", program.port);
app.set("root", program.config);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({}));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400; }
}));
app.disable('x-powered-by');

/* jshint ignore:start */
async function load(app) {
    await bs.applyConfig(app);
    await bs.applyModels(app);
    await bs.runServices(app);
    await bs.applyRoutes(app);
    await bs.bootScripts(app);
}


load(app).then(() => {
    app.use(errorHandler({
        debug: process.env.NODE_ENV === 'development',
        log: true,
    }));
    http.createServer(app)
        .listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
}).catch((error) => {
    console.error(chalk.bgRed(error));
    process.exit(0);
});
/* jshint ignore:end */
