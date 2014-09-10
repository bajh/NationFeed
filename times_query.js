var request = require('request'),
credentials = process.env.TIMES || require('api_keys.js').times;

function TimesQuery(database) {
  this.database = database;
}

TimesQuery.prototype.refresh = function() {
  this.congress = {};
  senateUrl = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/senate/members.json?&api-key=" + credentials;
  houseUrl = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/house/members.json?&api-key=" + credentials;
  query = this;
  this.makeQuery(senateUrl, 
    function(){ 
      setTimeout(query.makeQuery(houseUrl, query.saveCongress), 1000);
    }
  );
};

TimesQuery.prototype.makeQuery = function(url, callback, data) {
  query = this;
  request(url, function(error, response, body){
    try {
      data = JSON.parse(body).results[0].members;
    }
    catch(err) {
      console.log(body);
    }
    query.reduceData(data);
    callback();
  })
};

TimesQuery.prototype.reduceData = function(data, callback) {
  query = this;
  data.forEach(function(person){
    congressPerson = {};
    // congressPerson.chamber = person.role.split(",")[0]
    congressPerson.name = person.first_name + ' ' + person.last_name;
    congressPerson.party = person.party;
    congressPerson.twitter_account = person.twitter_account;
    if (query.congress[person.state]) {
      query.congress[person.state].push(congressPerson);
    } else {
      query.congress[person.state] = [congressPerson];
    }
  });
};

TimesQuery.prototype.saveCongress = function() {
  query.database.set("congress", JSON.stringify(query.congress));
};

module.exports = TimesQuery;