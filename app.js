var app = require('express')(),
    url = require('url'),
    request = require('request'),
    queryString = require('querystring'),
    btoa = require('btoa'),
    express = require('express'),
    port = process.env.PORT || 3000,
    http = require('http').Server(app),
    schedule = require('node-schedule'),
    TimesQuery = require('times_query.js'),
    credentials = require('api_keys.js'),
    // twitter_credentials = btoa("CcR1CPm3xphRk8AelPHXTsS0s:9Bl9mCDJ5FNVS4sc0irDSRPL1qQLF4cqe7b1vRA7USDKyptEJq"),
    bearer_token = credentials.token;

// var options = {
//   method: 'POST',
//   url: 'https://api.twitter.com/oauth2/token',
//   headers: {'User-Agent': 'NationFeed', Authorization: 'Basic ' + credentials,
//     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//   },
//   body: "grant_type=client_credentials"
// }

// request(options, function(err, res, body){
//   token = JSON.parse(body)["access_token"]);
// });

var get_options = {
  method: 'GET',
  url: 'https://api.twitter.com/1.1/users/lookup.json?screen_name=nygovcuomo,timbishopny,RepPeteKing,RepSteveIsrael,RepMcCarthyNY',
  headers: {
    'User-Agent': 'NationFeed',
    'Authorization': 'Bearer ' + token
  }
}

//["profile_image_url"]

request(get_options, function(err, res, body){
  results = JSON.parse(body);
  results.forEach(function(person){
    console.log(person["profile_image_url"])
  });
});

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var redis = require('redis').createClient(rtg.port, rtg.hostname)
  redis.auth(rtg.auth.split(":")[1])
} else {
  var redis = require('redis').createClient();
}

// var timesQuery = new TimesQuery(redis);

app.use(express.static(__dirname + '/public'));

app.get('/tweets-for-state', function(req, res){
  var reqUrl = url.parse(req.url);
  var state = reqUrl.query;
  redis.get("congress", function(err, reply){
    stateReps = JSON.parse(reply)[state];
    res.send(stateReps);
  });
});

app.get('/tweets-for-user', function(req, res){

});

// timesQuery.refresh();
// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = 0;
// var j = schedule.scheduleJob(rule, function(){
//   timesQuery.refresh();
// });

http.listen(port, function(){});