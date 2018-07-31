# winston-slacker [![Build Status](https://travis-ci.org/meerkats/winston-slacker.svg)](https://travis-ci.org/meerkats/winston-slacker)
Slack integration for Winston 3

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
var WinstonSlacker = require('winston-slacker');
var options = {
  // Set options up
};
winston.add(new WinstonSlacker(options));
```

You are done configuring winston-slacker. Now it's time to use it! 

```js
// Log a message with winston
winston.log({
  level: 'info',
  message: 'User has logged in successfully.'
})

// Then, see in Slack:
// [info] User has logged in successfully.
```

# Tests

To run tests run `npm install` and then `npm test` from the root directory in your shell.
