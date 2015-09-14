var request = require('request');
var sinon = require('sinon');
var Slack = require('../index.js');

describe('winston-slacker', function () {
  it('should fail if no webhook has been supplied in the options', function () {
    expect(function () { new Slack(); }).toThrow(new Error('Invalid options parameter'));
  });
  it('should have expected default options', function () {
    var webhook = 'https://hooks.slack.com/services/testhook';
    var default_options = {
      channel: '#general',
      username: 'winston-slacker',
      iconUrl: false,
      iconEmoji: false,
      level: 'info',
      silent: false,
      raw: false,
      name: 'slacker',
      handleExceptions: false
    };
    //Add webhook on to the default_options
    default_options.webhook = webhook;
    var slack = new Slack({ webhook: webhook });
    expect(slack.options).toEqual(default_options);
  });
  it('should override default options if passed in', function () {
    var override_options = {
      channel: '#test',
      username: 'winston-slacker-test',
      iconUrl: true,
      iconEmoji: true,
      level: 'test',
      silent: true,
      raw: true,
      name: 'tester',
      handleExceptions: true,
      webhook: 'https://hooks.slack.com/services/testhook'
    };
    var slack = new Slack(override_options);
    expect(slack.options).toEqual(override_options);
  });
  describe('log', function () {
    var options = null;
    var slack = null;
    beforeEach(function(){
      sinon.stub(request, 'post');
      options = {
        webhook: 'https://hooks.slack.com/services/testhook'
      };
      slack = new Slack(options);
      request.post.callsArgWith(1, null, null, 'ok');
    });
    afterEach(function(){
      request.post.restore();
    });
    it('should format a message as expected by default', function (done) {
      slack.log('test', 'test message', {}, function (err, result) {
        var return_value = request.post.getCall(0).args[0];
        expect(return_value.body.text).toEqual('[test] test message');
        done();
      });
    });
    it('should format a message as expected by a custom formatter', function (done) {
      slack.customFormatter = function (level, message) { return [message, level].join(' '); };
      slack.log('test', 'test message', {}, function (err, result) {
        var return_value = request.post.getCall(0).args[0];
        expect(return_value.body.text).toEqual('test message test');
        done();
      });
    });
    it('should fail when no message is send to log', function (done) {
      slack.customFormatter = function (level, message) { };
      slack.log('test', 'test message', {}, function (err) {
        expect(err.message).toEqual('No message');
        done();
      });
    });
  });
});
