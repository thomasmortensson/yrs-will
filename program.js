document.addEventListener("DOMContentLoaded", function() {

    //Dont highlight things unless you need to plz, thx
    //also listen to warnings plz thx
    var service;
    var map;

    function initialize() {
        var mapOptions = {
            center: {
                lat: 51.454513,
                lng: -2.58791
            },
            zoom: 5
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        service = new google.maps.places.PlacesService(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $(".form").submit(function(e) {
        e.preventDefault();
    });

    $("#city-search").keyup(

        function(event) {
            console.log("city");
            var ENTER = 13;

            var query = {
                query: this.value
            };
            if (event.keyCode == ENTER) {
                console.log(query);
                service.textSearch(query, function(results) {
                    console.log(results);
                    var location = results[0]["geometry"]["location"];
                    map.panTo(location);
                    map.setZoom(9);
                });
                
        $.getJSON("road_accidents_reduced.json",function(data){
            for (var accident in data){
                var accidentObject = data[accident];
                var latitude =accidentObject["Latitude"];
                var longitude=accidentObject["Longitude"];
                var severity = accidentObject["Accident_Severity"];
                var image;
                if (severity == 1){
                    image = "media/green_icon.png";
                } else if (severity == 2){
                    image = "media/yellow_icon.png";
                } else if (severity == 3){
                    image = "media/purple_icon.png";
                }
                console.log (latitude,longitude);
                
                var mapWindowContent = "Speed Limit: " + accidentObject  Number of Vehicles: 3 Number of Casualties: 4 Date: 4/1/1999 Time: 00:00;
                
                // var infoWindow = google.maps.InfoWindow({
                //     content: mapWindowContent
                // });
                
                var marker2 = new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    map: map,
                    icon: image
                });
                
                // google.maps.event.addListener(marker2, 'click', function(){
                //     infoWindow.open(map.marker2);
                // });
            }
        });

            }
        });

    function getData() {
        console.log("getdata");
        var apiKey = "d6d02fe2-35dc-4e52-9876-6b0db32a30e9";
        console.log("after api");
        $.getJSON("http://datapoint.metoffice.gov.uk/public/data/txt/wxobs/ukextremes/json/latest?key=" + apiKey, function(data) {
            console.log(data);
            console.log("hello");
            var locations = [];
            for (var region in data["UkExtremes"]["Regions"]["Region"]) {
                for (var extreme in data["UkExtremes"]["Regions"]["Region"][region]["Extremes"]["Extreme"]) {
                    var extremeObject = data["UkExtremes"]["Regions"]["Region"][region]["Extremes"]["Extreme"][extreme];
                    var location = extremeObject["locId"];
                    locations.push(location);
                }
            }
            $.getJSON("locations.json", function(data) {
                for (var extremeLocation in locations) {
                    var extremeLocationId = locations[extremeLocation];
                    for (var location in data["Locations"]["Location"]) {
                        var locationObject = data["Locations"]["Location"][location];
                        if (locationObject["id"] == extremeLocationId) {
                            var lat = locationObject["latitude"];
                            var lon = locationObject["longitude"];
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(lat, lon),
                                map: map,
                            });
                        }

                    }
                }
            });
        });
    }

    getData();

});
