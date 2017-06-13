$.auth.configure({
  apiUrl: 'http://localhost:3000'
});

$(document).ready(function(){

  $('#headerForm').submit(function(event){
    event.preventDefault();
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
        var str = JSON.stringify(data, undefined, 4);
        output(syntaxHighlight(str));
      }
    });
  })

});
