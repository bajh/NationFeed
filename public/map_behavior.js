$(function(){

  var clickedStates = {};

//Michigan needs to be handled specially because it's composed of two SVG paths
  $('g').on('click', function(e){
    e.stopPropagation();
    cleanPage();
    if (clickedStates["MI"]) {
      console.log("Located in cache");
      console.log(clickedStates["MI"]);
      displayTweetsFromCache("MI");
    } else {
      getAndDisplayTweetsFor("MI");
    }
    $('#MI-').css('fill', '#3538FF');
    $('#SP-').css('fill', '#3538FF')
  });

  $('#us_map').on('click', 'path', function(){
    cleanPage();
    clickedPath = $(this);
    clickedState = clickedPath.attr('id');
    if (clickedStates[clickedState]){
      console.log("Located in cache");
      console.log(clickedStates[clickedState]);
      displayTweetsFromCache(clickedState);
      styleClickedState();
    } else {
      if (clickedState != "MI-" && clickedState != "SP-") {
        getAndDisplayTweetsFor(clickedState, styleClickedState);
      }
    }
  });

  function styleClickedState(){
    if (clickedState == "AK" || clickedState == "HI" || clickedState == "CA" || clickedState == "OR" || clickedState == "WA" || clickedState == "NV" || clickedState == "ID" || clickedState == "NM" || clickedState == "MT" || clickedState == "AZ" || clickedState == "CO" || clickedState == "UT" || clickedState == "WY") {
      $sideBar.css('right', '0');
      $sideBar.css('left', '');
      $sideBar.css('-webkit-box-shadow', '-3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
      $sideBar.css('-mox-box-shadow', '-3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
      $sideBar.css('box-shadow', '-3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
    } else {
      $sideBar.css('right', '');
      $sideBar.css('left', '0');
      $sideBar.css('-webkit-box-shadow', '3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
      $sideBar.css('-mox-box-shadow', '3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
      $sideBar.css('box-shadow', '3px 0px 0px 0px rgba(191, 0, 20, 0.5)');
    };
    clickedPath.css('fill', stateColor(clickedState));
  }

  function stateColor(state){
    blue = ['WA', 'MN', 'OR', 'HI', 'CA', 'NV', 'CO', 'NM', 'NM', 'IA', 'WI', 'IL', 'OH', 'PA', 'VA', 'NY', 'ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'VA', 'FL']
    red = ['AR', 'UT', 'AZ', 'ID', 'MT', 'WY', 'ND', 'SD', 'NE', 'KS', 'OK', 'TX', 'MO', 'AK', 'LA', 'MS', 'AL', 'TN', 'IN', 'KY', 'WV', 'NC', 'SC', 'GA']
    for (i = 0; i < blue.length; i++) {
      if (state == blue[i]) {
        return '#3538FF';
      }
    };
    for (i = 0; i < red.length; i++) {
      if (state == red[i]) {
        return '#BF0014';
      }
    };
  }

  $('#exit').on('click', function(){
    cleanPage();
  });

  function getAndDisplayTweetsFor(state, callback){
    $.ajax({
      url: '/tweets-for-state',
      data: state,
      dataType: 'json',
      success: function(res){
        $sideBar = $('#side_bar');
        res.forEach(function(mc, i){
          if (i == 0 || i == 1) {
            mc.chamber = "Sen."
          } else {
            mc.chamber = "Rep."
          }
          displayTweetsBy(mc);
          //Note sure about the scoping here
          if (callback) { callback();};
        });
        clickedStates[state] = res;
        $sideBar.show();
      }
    })
  }

  function displayTweetsBy(mc) {
    $('#mcs ul').append(mcElementFor(mc));
  }

  function displayTweetsFromCache(state) {
    clickedStates[state].forEach(function(mc){
      console.log("About to display!");
      console.log(clickedStates[state]);
      displayTweetsBy(mc);
      $sideBar.show();
    });
  }

  function cleanPage(){
    $('.mc').remove();
    $('#side_bar').hide();
    $('path').css('fill', 'rgb(211, 211, 211)')
  }

  function mcElementFor(mc) {
    twitter_account = mc.twitter_account ? ("<span class='twitter_account'>(<a href='https://twitter.com/" + mc.twitter_account + "' target='_blank'>" + mc.twitter_account + "</a>)</span>") : "";
    image = mc.profile_image_url ? ("<div class='image'><img src='" + mc.profile_image_url + "'></div>") : "";
    if (mc.status_created_at) {
      time = mc.status_created_at.split(" ").slice(0, 3); 
      if (time[2].split("")[0] == 0) {
        time[2] = time[2].split("")[1]
      }
      time = time.join(" ")
    }
    recent_tweet = mc.status ? ( "<div class='tweet'>" + mc.status + "<div class='date'>" + time + "</div></div>") : ("<div class='tweet'>No tweets!</div>");
    return "<li><div class='mc " + mc.party + "'><div class='header'><div class='banner'></div><div class='name'>" + mc.chamber + " " + mc.name + twitter_account + "</div></div>" + image + recent_tweet + "</div></div></li>";
  }

})