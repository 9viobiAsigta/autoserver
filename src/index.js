'use strict';


const http = require('http');

const console = require('./utilities/console');
const fakeRequest = require('./utilities/fake_request');
const requestHandler = require('./protocol/request_handler');

require('./debugging');


const port = process.env.PORT || 5001;
const host = 'localhost';

const startServer = function () {
  http
    .createServer(requestHandler)
    .listen(port, host, listeningHandler);
};

const listeningHandler = function () {
  console.log(`Listening on ${host}:${port}`);
  //fakeRequest({ host, port });
};

startServer();


module.exports = startServer;