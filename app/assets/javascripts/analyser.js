$(document).ready(function(){

  var updateResults = function(data){
    var html = ""
    received = data.Received
    length = received.length
    for (i = 0; i < length; i++) {
      html += "<tr><td align='center'><a data-toggle='collapse' href='javascript:void(0)' aria-expanded='true'><span title='ID: "
      html += received[i].id
      html += "' data-toggle='tooltip'>"
      html += received[i].step + 1
      html += "</span></a></td><td>"
      html += received[i].from.IP
      html += "</td><td>"
      html += received[i].by
      html += "</td><td><a data-toggle='collapse' href='javascript:void(0)' aria-expanded='true'><span title='"
      html += received[i].with.protocol_description
      html += "' data-toggle='tooltip'>"
      html += received[i].with.protocol
      html += "</td><td>"
      html += received[i].for
      html += "</td><td><span class='text-muted'><i class='fa fa-clock-o'></i> "
      html += received[i].timestamp
      html += "</span></td></tr>"
    }
    $("#receivedTable").html(html)
    $('[data-toggle="tooltip"]').tooltip()
    var ipArray = []
    for (i = 0; i < length; i++) {
      var hop = received[i].step + 1
      var ip = received[i].from.IP
      if (ip !== "") {
        ipArray.push({
          'hop' : hop,
          'ip'  : ip
        })
      }
    }
    google.maps.event.addDomListener(window, 'load', initMap(ipArray));
  }

  var analyse = function(data){
    $.ajax({
      type: "POST",
      url: "/headers/create",
      data: data,
      success: function(data) {
        $("#headerTextRow").slideUp();
        $("#resultsRow, #receivedRow").fadeIn();
        updateResults(data)
      }
    });
  }

  $('#analyseButton').click(function(event){
    var data = {
      'header': {
        'text': $('#headerInput').val(),
        'name': $('#headerNameInput').val(),
        'description': $('#headerDescriptionInput').val(),
        'save': $('#saveBox').is(':checked')
      }
    };
    analyse(data);
  })


  $('#backButton').click(function () {
    $("#headerTextRow").slideDown();
    $("#resultsRow, #receivedRow").fadeOut();
    if ($('#saveBox').is(':checked')) {
      $("#additionalInfo").show();
    }
  });
  $('#saveBoxDiv').click(function (){
    if ($('#saveBox').is(':checked')) {
      $("#additionalInfo").fadeIn();
    } else {
      $("#additionalInfo").fadeOut();
    }
  });

  (function(){
    var header = sessionStorage.getItem('header')
    if (header) {
      var obj = $.parseJSON(header)
      sessionStorage.removeItem('header');
      var data = {
        'header': {
          'text': obj.text,
          'name': obj.name,
          'description': obj.description,
          'save': false
        }
      };
      analyse(data)
      $('#headerInput').val(obj.text),
      $('#headerNameInput').val(obj.name),
      $('#headerDescriptionInput').val(obj.description),
      $('#saveBox').attr('checked', false)
    }
  })()




});
