# winston-slacker [![Build Status](https://travis-ci.org/meerkats/winston-slacker.svg)](https://travis-ci.org/meerkats/winston-slacker)
Slack integration for Winston

# Installing

```
$ npm install winston-slacker
```

This transport can be used like most standard Winston transports to send messages to a Slack channel.

## Options

Standard options are support as well as the following additions:
 - `webhook`: Your Slack channel's webhook URL
 - `channel`: The channel to send messages to (with the `#` like `#general`)
 - `username`: The username to use for the message in Slack
 - `iconUrl`: URL for Slackbot avatar
 - `iconImoji`: Emoji for Slackbot icon
 - `customFormatter`: Function used to format the message for Slack

```js
var winston = require('winston');
var winstonSlacker = require('winston-slacker');
var options = {
  // Set options up
};
winston.add(winstonSlacker, options);
```

# Tests

To run tests run `npm install` and then `npm test` from the root directory in your shell.
