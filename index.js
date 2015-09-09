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
  this.customFormatter = options.customFormatter;
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
 * @param {string} Message text
 * @param {function} Callback function for post execution
 */
  this.send = function (message, callback) {
    var callback = callback || function () {};
    if (!message) {
      return callback(new Error('No message'));
    }
    var requestParams = {
      url: this.webhook,
      body: extend(options, { text: message }),
      json: true
    };
    request.post(requestParams, function(err, res, body) {
      if (err || body !== 'ok') {
        return callback(err || new Error(body));
      }
       callback(err, body);
    });
  };
};

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
    // Use custom formatter for message if set
    var slackMessage = this.customFormatter ? this.customFormatter(level, message, meta) : 
      ['[', level , ']', ' ', message].join('');
    this.send(slackMessage, callback);
};

module.exports = Slack;
