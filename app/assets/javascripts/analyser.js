$(document).ready(function(){
  var updateResults = function(data){
    //Results highlights
    var highlightsHtml = ""
    info = data.Info
    infoLength = info.length
    var softwareList = []
    for (i = 0; i < infoLength; i++) {
      if (info[i].code == 2 || info[i].code == 3) {
        softwareList.push(info[i].hint.split(": ")[1])
      }
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
      var date = new Date(received[i].timestamp)
      var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
      var dateHTML = pad(date.getDate(),2) + " " + month + " " + date.getFullYear() + " " + pad(date.getHours(),2) + ":" + pad(date.getMinutes(),2) + ":" + pad(date.getSeconds(),2)
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
      routingHtml += dateHTML
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

    //NVD
    if (softwareList.length > 0) {
      $.ajax({
        type: "GET",
        url: "/softwares/search",
        data: {"term" : softwareList[0]},
        success: function(data) {
          updateCVE(data[0].vendor_name, data[0].name, false)
        }
      });
    }
  }

  var analyse = function(data){
    $.ajax({
      type: "POST",
      url: "/headers/create",
      data: data,
      success: function(data) {
        $("#headerTextRow").slideUp();
        $("#resultsRow, #receivedRow, #cveRow").fadeIn();
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
    $("#resultsRow, #receivedRow, #cveRow").fadeOut();
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
      updateCVE(vendor_str,software_str,true)
    },50);
  })

  var updateCVE = function(vendor,software,isCustomInput){
    if (isCustomInput) {

    }else {
      var textHTML = "The anlyser has found a product which best matches the software information presented in the header. <br> You may also use the search box below to look for vulnerability records of a specific product."
      $("#cveIntro").html(textHTML)
      $("#softwareInput").val(software.replace("_"," ") + " BY " + vendor.replace("_"," "))
    }
    $.ajax({
      url: "/softwares/cve_search",
      data: {'vendor'   : vendor,
             'software' : software},
      success: function(items){
        $("#cveTable").removeClass("footable-loaded")
        var html = ""
        items.forEach(function(item){
          var cvssHTML = ""
          switch(true) {
            case item.cvss >= 0.1 && item.cvss <= 3.9:
            cvssHTML = "<span class='label label-table label-success'>" + parseInt(item.cvss).toFixed(1) + "</span>"
            break;
            case item.cvss >= 4.0 && item.cvss <= 6.9:
            cvssHTML = "<span class='label label-table label-info'>" + parseInt(item.cvss).toFixed(1) + "</span>"
            break;
            case item.cvss >= 7.0 && item.cvss <= 8.9:
            cvssHTML = "<span class='label label-table label-warning'>" + parseInt(item.cvss).toFixed(1) + "</span>"
            break;
            case item.cvss >= 9.0 && item.cvss <= 10:
            cvssHTML = "<span class='label label-table label-danger'>" + parseInt(item.cvss).toFixed(1) + "</span>"
            break;
            default:
            cvssHTML = ""
          }
          var date = new Date(item.Modified)
          var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
          var dateHTML = pad(date.getDate(),2) + " " + month + " " + date.getFullYear() + " " + pad(date.getHours(),2) + ":" + pad(date.getMinutes(),2) + ":" + pad(date.getSeconds(),2)
          html += "<tr><td>"
          html += item.id ? item.id : "Not present"
          html += "</td><td>"
          html += cvssHTML
          html += "</td><td><span class='text-muted'><i class='fa fa-clock-o'></i> "
          html += dateHTML
          html += "</span></td><td>"
          html += item.access ? item.access.vector : "Not present"
          html += "</td><td>"
          html += item.access ? item.access.complexity : "Not present"
          html += "</td><td>"
          html += item.access ? item.access.authentication : "Not present"
          html += "</td><td>"
          html += item.impact ? item.impact.confidentiality : "Not present"
          html += "</td><td>"
          html += item.impact ? item.impact.integrity : "Not present"
          html += "</td><td>"
          html += item.impact ? item.impact.availability : "Not present"
          html += "</td><td>"
          html += item.summary ? item.summary : "Not present"
          html += "</td></tr>"
        })
        $("#cveResults").html(html)
        $('#cveTable').show()
        $('#cveTable').footable();
      }
    });
  }

  // $('#cveShowEntries').change(function (e) {
  //   e.preventDefault();
  //   var pageSize = $(this).val();
  //   $('#cveTable').data('page-size', pageSize);
  //   $('#cveTable').trigger('footable_initialized');
  // });

});
