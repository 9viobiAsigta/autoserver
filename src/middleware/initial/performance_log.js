'use strict';

// Log how the request handling takes
const performanceLog = async function (input) {
  // Total request time, stopped just before the response is sent
  const { log } = input;
  log.perf.all = log.perf.start('all', 'all');

  // Used by other middleware, like timestamp and requestTimeout
  input.now = Date.now();

  try {
    const response = await this.next(input);
    return response;
  } finally {
    await log.perf.report();
  }
};

module.exports = {
  performanceLog,
};
