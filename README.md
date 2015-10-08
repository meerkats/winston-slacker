# winston-slacker ![Travis CI](https://api.travis-ci.com/meerkats/winston-slacker.svg?token=MVCVqrrza3g2DhWaq6jD)
Slack integration for Winston

#Installing
`$ npm install winston-slacker`

This transport can be used like other basic transports in Winston.
Messages will be sent to the specified slack channel.

##Options
Standard options are support as well as the following additions:
 - webhook: Your channels webhook Url
 - channel: The channel to send messages to
 - username: The name displayed in slack
 - iconUrl: URL for slack bot icon
 - iconImoji: Emoji for slack bot icon
 - customFormatter: Function used to format the message for slack
```
var winston = require('winston');
var winstonSlacker = require('winston-slacker');
var options = {
  // Set options up
};
winston.add(winstonSlacker, options);
```

#Test Running
To run tests run `$ npm install` and then `$ npm test` from the root directory.
