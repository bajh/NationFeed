if (process.env.REDISTOGO_URL) {
  console.log('all is well')
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require('redis').createClient();
}

// var timesQuery = new TimesQuery(redis);
var twitterClient = new TwitterClient(redis);

var timesQuery = new TimesQuery(redis);
timesQuery.refresh();