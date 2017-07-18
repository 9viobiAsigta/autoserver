'use strict';

const { promisify } = require('util');

const { EngineError } = require('../../error');

// Make request fail after some timeout
const setRequestTimeout = async function (input) {
  const { log, now } = input;
  const perf = log.perf.start('protocol.setRequestTimeout', 'middleware');

  const timeoutPromise = startRequestTimeout({ now });

  perf.stop();
  const responsePromise = this.next(input)
    // We must use `setTimeout(0)` to allow the `setTimeout(requestTimeout)`
    // to properly work, i.e. we need to make current macrotask end.
    // E.g. if the whole request was done in a single macrotask that took
    // 20 minutes, setTimeout(requestTimeout) would still not be called.
    // eslint-disable-next-line promise/prefer-await-to-then
    .then(async val => {
      await promisify(setTimeout)(0);
      return val;
    });

  // We use Promise.race() to ensure proper error handling
  const response = Promise.race([timeoutPromise, responsePromise]);
  return response;
};

const startRequestTimeout = async function ({ now }) {
  // Take into account the time that has already passed since request started
  const delay = Date.now() - now;
  const timeout = Math.max(TIMEOUT - delay, 0);

  await promisify(setTimeout)(timeout);

  const message = `The request took too long (more than ${TIMEOUT / 1000} seconds)`;
  throw new EngineError(message, { reason: 'REQUEST_TIMEOUT' });
};

const TIMEOUT = 5000;

module.exports = {
  setRequestTimeout,
};
