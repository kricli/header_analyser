$(document).ready(function(){
  var updateResults = function(data){
    //Results highlights
    var highlightsHtml = ""
    info = data.Info
    infoLength = info.length
    for (i = 0; i < infoLength; i++) {
      highlightsHtml += "<p>"
      highlightsHtml += escapeHtml(info[i].description)
      highlightsHtml += "<a class='get-code' data-toggle='collapse' href='#dynamic"
      highlightsHtml += i
      highlightsHtml += "' aria-expanded='true'><i class='fa fa-file-text-o' title='Show hint' data-toggle='tooltip'></i></a></p><div class='collapse m-t-15' id='dynamic"
      highlightsHtml += i
      highlightsHtml += "' aria-expanded='true'><code>"
      highlightsHtml += escapeHtml(info[i].hint)
      highlightsHtml += "</code></div>"
    }
    $("#results").html(highlightsHtml)

    //Routing information
    var routingHtml = ""
    received = data.Received
    routingLength = received.length
    for (i = 0; i < routingLength; i++) {
      routingHtml += "<tr><td align='center'><a data-toggle='collapse' href='javascript:void(0)' aria-expanded='true'><span title='ID: "
      routingHtml += received[i].id ? received[i].id : 'Not present'
      routingHtml += "' data-toggle='tooltip'>"
      routingHtml += received[i].step + 1
      routingHtml += "</span></a></td><td>"
      routingHtml += received[i].from.IP ? received[i].from.IP : (received[i].from.address ? received[i].from.address : '<div class="label label-table label-info">Not present</div>')
      routingHtml += "</td><td>"
      routingHtml += received[i].by.address ? received[i].by.address : (received[i].by.IP ? received[i].by.IP : '<div class="label label-table label-info">Not present</div>')
      routingHtml += "</td><td><a data-toggle='collapse' href='javascript:void(0)' aria-expanded='true'><span title='"
      routingHtml += received[i].with.protocol_description
      routingHtml += "' data-toggle='tooltip'>"
      routingHtml += received[i].with.protocol ? received[i].with.protocol : '<div class="label label-table label-info">Not present</div>'
      routingHtml += "</td><td>"
      routingHtml += received[i].for ? received[i].for : '<div class="label label-table label-info">Not present</div>'
      routingHtml += "</td><td><span class='text-muted'><i class='fa fa-clock-o'></i> "
      routingHtml += received[i].timestamp
      routingHtml += "</span></td></tr>"
    }
    $("#receivedTable").html(routingHtml)
    $('[data-toggle="tooltip"]').tooltip()

    //Routing map
    var ipArray = []
    for (i = 0; i < routingLength; i++) {
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

  // $.ajax({
  //   url: "https://cve.circl.lu/api/search/microsoft/office",
  //   dataType: 'jsonp',
  //   success: function(data){
  //     console.log(data);
  //   }
  // });


  $("#softwareInput").smartAutoComplete({source: '/softwares/search', forceSelect: true, maxResults: 5, delay: 300 });

  $("#softwareInput").on('itemSelect', function(item){
    //very nasty
    setTimeout(function(){
      var value = item.currentTarget.value
      var splitted = value.split(" BY ")
      var software = splitted[0]
      var vendor = splitted[1]
      software_str = software.replace(" ","_")
      vendor_str = vendor.replace(" ","_")
      $.ajax({
        url: "/softwares/cve_search",
        data: {'vendor'   : vendor_str,
               'software' : software_str},
        success: function(data){
          console.log(data);
        }
      });
    },50);
  })

});
