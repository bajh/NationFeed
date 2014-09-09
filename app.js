var app = require('express')(),
    url = require('url'),
    request = require('request'),
    queryString = require('querystring'),
    express = require('express'),
    port = process.env.PORT || 3000,
    http = require('http').Server(app),
    schedule = require('node-schedule'),
    TimesQuery = require('times_query.js');

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var redis = require('redis').createClient(rtg.port, rtg.hostname)
  redis.auth(rtg.auth.split(":")[1])
} else {
  var redis = require('redis').createClient();
}

var timesQuery = new TimesQuery(redis);

app.use(express.static(__dirname + '/public'));

app.get('/tweets-for-state', function(req, res){
  var reqUrl = url.parse(req.url);
  // queryOb = queryString.parse(reqUrl.query);
  // jsonReq = JSON.parse(queryOb);
  var state = reqUrl.query;
  getStateSenators(state, res);
});

timesQuery.refresh();
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0;
var j = schedule.scheduleJob(rule, function(){
  timesQuery.refresh();
});

http.listen(port, function(){});