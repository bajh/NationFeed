$(function(){

  $('#us_map').on('click', 'path', function(){
    clickedPath = $(this);
    clickedState = clickedPath.attr('id');
    $.ajax({
      url: '/tweets-for-state',
      data: clickedState,
      dataType: 'json',
      success: function(res){
        $sideBar = $('#side_bar');
        $mcs = $('#mcs');
        res.forEach(function(mc){
          $mcs.append("<div class='mc "+ mc.party +"'>" + mc.name + "</div>")
        });
        $sideBar.show();
      }
    })
  });

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

  $('#exit').on('click', function(){
    $sideBar = $('#side_bar');
    $('.mc').remove();
    $sideBar.hide();
  });

})