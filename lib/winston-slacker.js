var request = require('request');
var util = require('util');
var winston = require('winston');

/**
 * Slack integration for Winston
 */
function Slack (options) {
  if (!(options && typeof options === 'object')) {
    throw new Error('Invalid options parameter');
  }
  else if (!options.webhook) {
    throw new Error('Webhook required in options');
  }
  this.webhook = options.webhook;
  this.channel = options.channel || '#general';
  this.username   = options.username   || "winston-slacker";
  this.icon_url   = options.icon_url   || false;
  this.icon_emoji = options.icon_emoji || false;
  this.level      = options.level      || 'info';
  this.silent     = options.silent     || false;
  this.raw        = options.raw        || false;
  this.name       = options.name       || 'slacker';
  this.customFormatter = options.customFormatter;
  // Enabled loging of uncaught exceptions
  this.handleExceptions = options.handleExceptions || false

  //Hide the heavy lifting of sending a message
  this.send = function (message, callback) {
    var has_callback = callback && typeof callback === 'function';
    if (!(message && typeof message === 'object' && message.text)) {
      if (has_callback) {
        return callback(new Error('No message'));
      }
      return 'No message';
    }

    var options = {
      channel: message.channel,
      text: message.text,
      username: message.username,
    };

    if (this.icon_emoji) {
      options.icon_emoji = this.icon_emoji;
    }
    if (this.icon_url) {
      options.icon_url = this.icon_url;
    }
    if (this.attachments) {
      options.attachments = this.attachments;
    }

    var request_params = {
      url: this.webhook,
      body: JSON.stringify(options)
    };

    request.post(request_params, function(err, res, body) {
      if ((err || body !== 'ok') && has_callback) {
        return callback(new Error(err || body));
      }
      if (has_callback) {
        callback(err, body);
      }
    });
  }
};

/**
 * Log method for Winston integration
 */
Slack.prototype.log = function (level, message, meta, callback) {
    // Use custom formatter for message if set
    message = this.customFormatter ? this.customFormatter(level, message, meta) : { 
      text: ['[', level , ']', ' ', message].join(''),
      channel: this.channel,
      username: this.username
    };
    this.send(message, callback);
};

util.inherits(Slack, winston.Transport);
winston.transports.Slack = Slack;

exports.Slack = Slack;