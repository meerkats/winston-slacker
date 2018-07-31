const extend = require('util-extend');
const request = require('request');
const sinon = require('sinon');
const Slack = require('../index.js');

describe('Slack', function () {
  const testingWebhook = 'https://hooks.slack.com/services/testhook';
  const createNewSlack = function (options) {
    return new Slack(extend(options ? options : {}, {
      webhook: testingWebhook
    }));
  };
  it('should fail if no webhook has been supplied in the options', function () {
    expect(function () {
      return new Slack();
    })
      .toThrow(new Error('Invalid webhook parameter'));
  });
  it('should correctly set the webhook to the give webhook parameter', function () {
    const slack = createNewSlack();
    expect(slack.webhook).toEqual(testingWebhook);
  });
  it('should have expected default options', function () {
    const defaultOptions = {
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
    const slack = createNewSlack();
    expect(slack.options).toEqual(defaultOptions);
  });
  it('should override default options if passed in', function () {
    const overrideOptions = {
      channel: '#test',
      username: 'winston-slacker-test',
      iconUrl: true,
      iconEmoji: true,
      level: 'test',
      silent: true,
      raw: true,
      name: 'tester',
      handleExceptions: true
    };
    const slack = createNewSlack(overrideOptions);
    expect(slack.options).toEqual(overrideOptions);
  });
  describe('#log', function () {
    let slack = null;
    beforeEach(function () {
      sinon.stub(request, 'post');
      slack = createNewSlack();
      request.post.callsArgWith(1, null, null, 'ok');
    });
    afterEach(function () {
      request.post.restore();
    });
    it('should format a message as expected by default', function (done) {
      slack.log({
        level: 'test',
        message: 'test message',
      }, function () {
        const returnValue = request.post.getCall(0).args[0];
        expect(returnValue.body.text).toEqual('[test] test message');
        done();
      });
    });
    it('should format a message as expected by a custom formatter', function (done) {
      slack.customFormatter = function (level, message) {
        return [message, level].join(' ');
      };
      slack.log({
        level: 'test',
        message: 'test message'
      }, function () {
        const returnValue = request.post.getCall(0).args[0];
        expect(returnValue.body.text).toEqual('test message test');
        done();
      });
    });
    it('should fail when no message is send to log', function (done) {
      slack.customFormatter = function () { };
      slack.log({
        level: 'test',
        message: 'test message'
      }, function (err) {
        expect(err.message).toEqual('No message');
        done();
      });
    });
  });
});
