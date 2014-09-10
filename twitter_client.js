var request = require('request'),
    api_key = process.env.TWITTER || require('./api_keys.js').token;

function TwitterClient(database) {
  this.database = database;
  this.credentials = api_key
}

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
  mcs.forEach(function(mc){
    twitter_handles.push(mc.twitter_account);
  });
  var options = {
    method: 'GET',
    url: 'https://api.twitter.com/1.1/users/lookup.json?screen_name=' + twitter_handles.join(","),
    headers: {
      'User-Agent': 'NationFeed',
      'Authorization': 'Bearer ' + this.credentials
    }
  }
  request(options, function(err, res, body){
    twitterAccounts = JSON.parse(body);
    twitterAccounts.forEach(function(account){
      index = getIndexFor(mcs, account.screen_name);
      if (account["status"]) {
        mcs[index]["status"] = account["status"]["text"];
        mcs[index]["status_created_at"] = account["status"]["created_at"];
      }
      mcs[index]["profile_image_url"] = account["profile_image_url"];
    });
    callback(mcs);
  });
};

  function getIndexFor(array, twitter_handle) {
    for(i = 0; i < array.length; i++) {
      if (array[i]["twitter_account"].toLowerCase() == twitter_handle.toLowerCase()) {
        return i;
      }
    }
  }

module.exports = TwitterClient;