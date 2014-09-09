var request = require('request')

function TimesQuery(database) {
  this.database = database;
  this.request = request;
}

TimesQuery.prototype.refresh = function() {
  this.congress = {};
  senateUrl = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/senate/members.json?&api-key=a70a2f051440f37f8729a2b648befb34:4:67126089";
  houseUrl = "http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/house/members.json?&api-key=a70a2f051440f37f8729a2b648befb34:4:67126089";
  query = this;
  this.makeQuery(senateUrl, 
    function(){ 
      setTimeout(query.makeQuery(houseUrl, query.saveCongress), 1000);
    }
  );
};

TimesQuery.prototype.makeQuery = function(url, callback, data) {
  query = this;
  this.request(url, function(error, response, body){
    data = JSON.parse(body).results[0].members;
    query.reduceData(data);
    callback();
  })
};

TimesQuery.prototype.reduceData = function(data, callback) {
  query = this;
  data.forEach(function(person){
    congressPerson = {};
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