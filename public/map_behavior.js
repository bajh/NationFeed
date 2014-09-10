$(function(){

  $('g').on('click', function(){
    $.ajax({
      url: '/tweets-for-state',
      data: "MI",
      dataType: 'json',
      success: function(res){
        // d3.select($('#MI-')[0]).enter().text("sup");
        // d3.select($('#SP-')[0]).enter().text("sup");
      }
    })
  });

  $('#us_map').on('click', 'path', function(){
    clickedPath = $(this);
    clickedState = clickedPath.attr('id');
    if (clickedState != "MI-" && clickedState != "SP-") {
      $.ajax({
        url: '/tweets-for-state',
        data: clickedState,
        dataType: 'json',
        success: function(res){
          $sideBar = $('#side_bar');
          $mcs = $('#mcs');
          res.forEach(function(mc){
            console.log(mc);
            $mcs.append("<div class='mc "+ mc.party +"'>" + mc.name + "<img src='" + mc.profile_image_url + "'</img></div>");
            if (clickedState == "CA" || clickedState == "OR" || clickedState == "WA" || clickedState == "NV" || clickedState == "ID" || clickedState == "NM" || clickedState == "MT" || clickedState == "AZ" || clickedState == "UT") {
              $sideBar.css('right', '0');
            }
          });
          $sideBar.show();
        }
      })
    }
  });

  $('#exit').on('click', function(){
    $sideBar = $('#side_bar');
    $('.mc').remove();
    $sideBar.hide();
  });

})