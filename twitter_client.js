var request = require('request'),
    credentials = require('api_keys.js').token;

function TwitterClient(database) {
  this.database = database;
}

//When I publish this to Heroku I will need to pass in the correct token in order to generate the bearer token
TwitterClient.prototype.getBearerToken = function(token) {
  var options = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth2/token',
    headers: {'User-Agent': 'NationFeed', Authorization: 'Basic ' + token,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: "grant_type=client_credentials"
  };
  request(options, function(err, res, body){
    return JSON.parse(body)["access_token"];
  });
}

TwitterClient.prototype.getImagesAndRecentTweetsFor = function(mcs, callback) {
  twitter_handles = [];
  no_account = [];
  mcs.forEach(function(mc, i){
    if (mc.twitter_account) {
      twitter_handles.push(mc.twitter_account);
    } else {
      no_account.push(i);
    }
  });
  var options = {
    method: 'GET',
    url: 'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + twitter_handles.join(","),
    headers: {
      'User-Agent': 'NationFeed',
      'Authorization': 'Bearer ' + credentials
    }
  };
  request(options, function(err, res, body){
    results = JSON.parse(body);
    next_without_account = no_account.shift();
    mcs.forEach(function(person, i){
      if (next_without_account == i) {
        next_without_account = no_account.shift();
      } else {
        nextResult = results.shift();
        if (nextResult["status"]) {
          mcs[i]["status"] = nextResult["status"]["text"];
          mcs[i]["status_created_at"] = nextResult["status"]["created_at"];
        }
        mcs[i]["profile_image_url"] = nextResult["profile_image_url"];
      }
    });
    callback(mcs);
  });
}

module.exports = TwitterClient;