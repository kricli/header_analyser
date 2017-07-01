var map;

var curvature = 0.5; // how curvy to make the arc

var initMap = function(array) {
  var Map = google.maps.Map,
  LatLng = google.maps.LatLng,
  LatLngBounds = google.maps.LatLngBounds,
  Marker = google.maps.Marker,
  Point = google.maps.Point;

  var bounds = new LatLngBounds();

  array.forEach(function(item) {
    var url = "https://freegeoip.net/json/" + item.ip
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data){
        item.latitude = data.latitude;
        item.longitude = data.longitude
      }
    });
  })

  $(document).ajaxStop(function () {
    var ipArray = []
    //remove duplicates
    array.forEach(function(item) {
      if (ipArray.length !== 0 && (item.latitude === ipArray[ipArray.length - 1].latitude && item.longitude === ipArray[ipArray.length - 1].longitude)) {
        ipArray[ipArray.length - 1].lastHop = item.hop
      } else {
        ipArray.push({
          latitude  : item.latitude,
          longitude : item.longitude,
          firstHop  : item.hop,
          lastHop   : item.hop,
          pos       : new LatLng(item.latitude,item.longitude)
        })
      }
    });

    ipArray.forEach(function(item) {
      bounds.extend(item.pos);
    });

    map = new Map(document.getElementById('map-canvas'), {
      center: bounds.getCenter(),
      zoom: 12
    });

    map.fitBounds(bounds);

    ipArray.forEach(function(item) {
      var labelStr = ""
      if (item.firstHop === item.lastHop) {
        labelStr = item.firstHop.toString()
      } else {
        labelStr = item.firstHop + "-" + item.lastHop
      }
      item.marker = new Marker({
        position: item.pos,
        draggable: false,
        label: labelStr,
        map: map
      });
    })

    var curveMarker = []

    function updateCurveMarker() {

      projection = map.getProjection()

      var zoom = map.getZoom(),
      scale = 1 / (Math.pow(2, -zoom));

      ipArray.forEach(function(item) {
        item.pos = item.marker.getPosition()
        item.p = projection.fromLatLngToPoint(item.pos)
      })

      for (i = 0; i < ipArray.length - 1; i++) {
        var p1 = ipArray[i].p
        var p2 = ipArray[i+1].p
        var e = new Point(p2.x - p1.x, p2.y - p1.y), // endpoint (p2 relative to p1)
        m = new Point(e.x / 2, e.y / 2), // midpoint
        o = new Point(e.y, -e.x), // orthogonal
        c = new Point( // curve control point
          m.x + curvature * o.x,
          m.y + curvature * o.y);
          var pathDef = 'M 0,0 ' + 'q ' + c.x + ',' + c.y + ' ' + e.x + ',' + e.y;
          var symbol = {
            path: pathDef,
            scale: scale,
            strokeWeight: 1,
            fillColor: 'none'
          };
          if (!curveMarker[i]) {
            curveMarker[i] = new Marker({
              position: ipArray[i].pos,
              clickable: false,
              icon: symbol,
              zIndex: 0, // behind the other markers
              map: map
            });
          } else {
            curveMarker[i].setOptions({
              position: ipArray[i].pos,
              icon: symbol,
            });
          }
        }
      }
      google.maps.event.addListener(map, 'projection_changed', updateCurveMarker);
      google.maps.event.addListener(map, 'zoom_changed', updateCurveMarker);
      ipArray.forEach(function(item) {
        google.maps.event.addListener(item.marker, 'position_changed', updateCurveMarker);
      })
  });


}

var GmapsCubicBezier = function (latlong1, latlong2, latlong3, latlong4, resolution, map) {
  var lat1 = latlong1.lat();
  var long1 = latlong1.lng();
  var lat2 = latlong2.lat();
  var long2 = latlong2.lng();
  var lat3 = latlong3.lat();
  var long3 = latlong3.lng();
  var lat4 = latlong4.lat();
  var long4 = latlong4.lng();

  var points = [];

  for (it = 0; it <= 1; it += resolution) {
    points.push(this.getBezier({
      x: lat1,
      y: long1
    }, {
      x: lat2,
      y: long2
    }, {
      x: lat3,
      y: long3
    }, {
      x: lat4,
      y: long4
    }, it));
  }
var path = [];
  for (var i = 0; i < points.length - 1; i++) {
    path.push(new google.maps.LatLng(points[i].x, points[i].y));
    path.push(new google.maps.LatLng(points[i + 1].x, points[i + 1].y, false));
  }
  return Line;
};
GmapsCubicBezier.prototype = {
  B1: function (t) {
    return t * t * t;
  },
  B2: function (t) {
    return 3 * t * t * (1 - t);
  },
  B3: function (t) {
    return 3 * t * (1 - t) * (1 - t);
  },
  B4: function (t) {
    return (1 - t) * (1 - t) * (1 - t);
  },
  getBezier: function (C1, C2, C3, C4, percent) {
    var pos = {};
    pos.x = C1.x * this.B1(percent) + C2.x * this.B2(percent) + C3.x * this.B3(percent) + C4.x * this.B4(percent);
    pos.y = C1.y * this.B1(percent) + C2.y * this.B2(percent) + C3.y * this.B3(percent) + C4.y * this.B4(percent);
    return pos;
  }
};
