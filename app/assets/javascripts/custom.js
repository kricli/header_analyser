$(document).ready(function(){
  $('#headerForm').submit(function(event){
    var data = {
      'header': {
        'text': $('#headerInput').val(),
      }
    };
    $.ajax({
      type: "POST",
      url: "/headers/create",
      data: data,
      success: function(data) {
        console.log(JSON.stringify(data))
      }
    });
  })
});
