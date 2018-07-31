const extend = require('util-extend');
const request = require('request');
const Transport = require('winston-transport');

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
module.exports = class Slack extends Transport {
  constructor(options) {
    super(options);

    const suppliedOptions = options ? options : {};
    if (!suppliedOptions.webhook || typeof suppliedOptions.webhook !== 'string') {
      throw new Error('Invalid webhook parameter');
    }
    this.name = 'slack';
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
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const message = this.customFormatter(info.level, info.message);
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
};
