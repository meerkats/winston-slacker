var extend = require('util-extend');
var request = require('request');
var util = require('util');
var winston = require('winston');

/**
 * Slack integration for Winston
 */
function Slack(options) {
  if (typeof options !== 'object' || !options.webhook) {
    throw new Error('Invalid options parameter');
  }
  this.webhook = options.webhook;
  this.customFormatter = options.customFormatter || defaultFormatter;
  this.options = extend({
    channel: '#general',
    username: 'winston-slacker',
    iconUrl: false,
    iconEmoji: false,
    level: 'info',
    silent: false,
    raw: false,
    name: 'slacker',
    handleExceptions: false
  }, options);

  /**
 * Handles the sending of a message to an Incoming webhook
 * @param {text} Message text
 * @param {function} Callback function for post execution
 */
  this.send = function (message, callback) {
    callback = callback || function () {};
    if (!message) {
      return callback(new Error('No message'));
    }
    var requestParams = {
      url: this.webhook,
      body: extend(options, { text: message }),
      json: true
    };
    request.post(requestParams, function(err, res, body) {
      if ((err || body !== 'ok')) {
        return callback(err || new Error(body));
      }
      callback(err, body);
    });
  };
}

/**
 * Default formatting for messages sent to Slack
 * @param {string} Logging level
 * @param {string} Message to send to slack
 */
function defaultFormatter (level, message) {
  return ['[', level , ']', ' ', message].join('');
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
  this.send(this.customFormatter(level, message, meta), callback);
};

module.exports = Slack;
