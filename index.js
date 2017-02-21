"use strict";
const http = require('http')
    , express = require('express')
    , program = require('commander')
    , load = require('./lib/bootstrap')
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
    .option('-d, --dir [value]', 'Set folder with config file (config.json)', path.resolve(__dirname))
    .option('-e, --environment [value]', 'Define environment', /^(development|production|test)$/i, 'development')
    .parse(process.argv);

let app = module.exports = express();
let port = program.port || 3005;
process.env.NODE_ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : program.environment;

app.set("port", program.port);
app.set("root", program.dir);
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

if (require.main === module) {
    load(app).then(() => {
        app.use(errorHandler({
            debug: process.env.NODE_ENV === 'development',
            log: true,
        }));
        http.createServer(app)
            .listen(port, () => {
                app.emit('loaded');
                console.log(`Server is listening on ${port}`);
            });
    }).catch((error) => {
        console.error(chalk.bgRed(error));
        process.exit(0);
    });
}
