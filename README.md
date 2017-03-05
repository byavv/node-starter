[![CircleCI][circle-image]][circle-url]

## Boilerplate application for building RESTful APIs (WIP)

## Requirements:
 - MongoDb
 - Node.js > 7.* (runs with --harmony only)

## Basic Usage
```bash
# clone the repo
$ git clone https://github.com/byavv/node-starter.git
$ cd node-starter

# install 
$ npm install

# run development/production
$ npm run dev  
$ npm start    

# run tests
$ npm test

```
// https://github.com/KunalKapadia/express-mongoose-es6-rest-api
## Overview
### Modules

Building blocks of the application. Any module consists of model ([Mongoose scheme](http://mongoosejs.com/docs/guide.html)), controller and router. 
Application automatically constructs api according to [configurating file](https://github.com/byavv/node-starter/blob/master/config.json) and router-provided entries.

### Services

Stand-alone application modules available throughout the whole application. Use them for integrating of any kind. Examples provided.


[circle-image]: https://circleci.com/gh/byavv/node-starter.svg?style=shield
[circle-url]: https://circleci.com/gh/byavv/node-starter
