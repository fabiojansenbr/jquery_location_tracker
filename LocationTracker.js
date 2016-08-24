window.onload = init;

// location 
var latitude, longitude;

// Google map
var map = null;

// Path
var path = [];

var lastMarker = null;

//Watch Id and counter
var counter = 0;


function init() {
        window.onload = displayLocation;
}


function displayLocation(position) {
    //Set the default counter equal to 0
    counter = 0;
    //get the json data
    $.getJSON("http://kalathur.com/cs701/cgi-bin/getRouteData.php?callback=?").done(function (data) {

        latitude = data[0].lat;
        longitude = data[0].lng;

      //set a interval function to call showSamplePath function by 0.3 second per intercal
    updateMyLocation = setInterval(function () {
        
        showSamplePath(counter);
        counter++;
        console.log(counter);
          if (counter > 196){
                return counter = 0;
            };
    }, 300);
    });
    // Show the google map with the position  
    addFirstMarker();
    showOnMap(position.coords);    
}


// initialize the map and show the position
function showOnMap() {
    $.getJSON("http://kalathur.com/cs701/cgi-bin/getRouteData.php?callback=?").done(function (data) {
    var googlePosition = 
        new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 12,
        center: googlePosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var mapElement = document.getElementById("map");
    map = new google.maps.Map(mapElement, mapOptions);
    
    // add the marker to the map
    var title = "Location Details";
    var content = "Lat: " + latitude + 
                    ", Long: " + longitude;
                    
    addMarker(map, googlePosition, title, content);
   
    });

}

function addFirstMarker() {
    $.getJSON("http://kalathur.com/cs701/cgi-bin/getRouteData.php?callback=?").done(function (data) {
        latitude = data[0].lat;
        longitude = data[0].lng;
        var firstPostion = new google.maps.LatLng(latitude, longitude);
        addMarker(map, firstPostion);
    });
}

// add position marker to the map
function addMarker(map, latlongPosition, title, content) {
   
    var options = {
        position: latlongPosition,
        map: map,
        icon: 'bus.png',
        title: title,
        clickable: false
    };
    var marker = new google.maps.Marker(options);

    var popupWindowOptions = {
        content: content,
        position: latlongPosition
    };

    var popupWindow = new google.maps.InfoWindow(popupWindowOptions);

    google.maps.event.addListener(marker, 'onload', function() {
        popupWindow.open(map);
    });
    
    return marker;
}


function showSamplePath(counter) {
    $.getJSON("http://kalathur.com/cs701/cgi-bin/getRouteData.php?callback=?").done(function (data) {
        var newlatitude = [];
        var newlongitude = [];
        var address = [];
        for (var i = 0; i < data.length; i++) {
            newlatitude.push(data[i].lat);
            newlongitude.push(data[i].lng);
            address.push(data[i].address);
        }

        path = [];

        // first point  
        var latlong = new google.maps.LatLng(newlatitude[counter], newlongitude[counter]);
        path.push(latlong);

        // next point

        latlong = new google.maps.LatLng(newlatitude[counter + 1], newlongitude[counter + 1]);

        path.push(latlong);


        $('#address').text('@ ' + address[counter])


        var line = new google.maps.Polyline({
            path: path,
            strokeColor: '#0000ff',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        line.setMap(map);

        map.panTo(latlong);
   
        if (lastMarker)
            lastMarker.setMap(null);
        // add the new marker

        lastMarker = addMarker(map, latlong, "new location");
    });
}






















