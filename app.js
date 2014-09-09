var app = require('express')(),
    url = require('url'),
    queryString = require('querystring'),
    express = require('express'),
    port = process.env.PORT || 3000,
    http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/tweets-for-state', function(req, res){
  reqUrl = url.parse(req.url);
  // queryOb = queryString.parse(reqUrl.query);
  // jsonReq = JSON.parse(queryOb);
  state = reqUrl.query;
  res.send({"msg": "You submitted a request for " + state});
});

http.listen(port, function(){});