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
  twitter_handles = mcs.map(function(mc){
    return mc.twitter_account;
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
    results.forEach(function(person, i){
      mcs[i]["status"] = person["status"]["text"];
      mcs[i]["status_created_at"] = person["status"]["created_at"]; 
      mcs[i]["profile_image_url"] = person["profile_image_url"];
    });
    callback(mcs);
  });
}

module.exports = TwitterClient;