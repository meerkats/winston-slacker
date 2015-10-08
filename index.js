const extend = require('util-extend');
const request = require('request');
const util = require('util');
const winston = require('winston');

/**
 * Default formatting for messages sent to Slack
 * @param {string} Logging level
 * @param {string} Message to send to slack
 */
function defaultFormatter(level, message) {
  return ['[', level, ']', ' ', message].join('');
}

/**
 * Slack integration for Winston
 * @param {object} Options parameter
 */
function Slack(options) {
  var suppliedOptions = options ? options : {};
  if (!suppliedOptions.webhook || typeof suppliedOptions.webhook !== 'string') {
    throw new Error('Invalid webhook parameter');
  }
  this.webhook = suppliedOptions.webhook;
  this.customFormatter = suppliedOptions.customFormatter || defaultFormatter;
  delete suppliedOptions.customFormatter;
  delete suppliedOptions.webhook;
  this.options = extend({
    channel: '#general',
    username: 'winston-slacker',
    iconUrl: false,
    iconEmoji: false,
    level: 'info',
    silent: false,
    raw: false,
    name: 'slacker',
    handleExceptions: false,
  }, suppliedOptions);
}

/**
 * Handles the sending of a message to an Incoming webhook
 * @param {text} Message text
 * @param {function} Callback function for post execution
 */
function send(message, callback) {
  const suppliedCallback = callback || function () {};
  if (!message) {
    return suppliedCallback(new Error('No message'));
  }
  const requestParams = {
    url: this.webhook,
    body: extend(this.options, { text: message }),
    json: true
  };
  return request.post(requestParams, function (err, res, body) {
    if (err || body !== 'ok') {
      return suppliedCallback(err || new Error(body));
    }
    return suppliedCallback(null, body);
  });
}

util.inherits(Slack, winston.Transport);
winston.transports.Slack = Slack;

/**
 * Log method for Winston integration
 * @param {string} Logging level
 * @param {string} Message to send to slack
 * @param {string} Meta data for styling
 * @param {function} Callback function for post execution
 */
Slack.prototype.log = function (level, message, meta, callback) {
  return send.call(this, this.customFormatter(level, message, meta), callback);
};

module.exports = Slack;
