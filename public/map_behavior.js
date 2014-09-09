$(function(){
  $('#us_map').on('click', 'path', function(){
    clickedState = $(this).attr('id');
    $.ajax({
      url: '/tweets-for-state',
      data: clickedState,
      dataType: 'json',
      success: function(res){
        console.log(res);
      }
    })
  })
})