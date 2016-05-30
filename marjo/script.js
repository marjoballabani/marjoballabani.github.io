/**
 * Created by User on 30/05/2016.
 */
var polygonePoints = [
    {lat: 25.774, lng: -80.190},
    {lat: 18.466, lng: -66.118},
    {lat: 32.321, lng: -64.757}
];

var polylinesPoints = [
    {lat: 37.772, lng: -122.214},
    {lat: 21.291, lng: -157.821},
    {lat: -18.142, lng: 178.431},
    {lat: -27.467, lng: 153.027}
];

var citymap = {
    chicago: {
        center: {lat: 41.878, lng: -87.629},
        population: 2714856
    },
    newyork: {
        center: {lat: 40.714, lng: -74.005},
        population: 8405837
    },
    losangeles: {
        center: {lat: 34.052, lng: -118.243},
        population: 3857799
    },
    vancouver: {
        center: {lat: 49.25, lng: -123.1},
        population: 603502
    }
};
var circles = [];

function initMap() {
    /* Map declaration */
    var map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 41.327729, lng: 19.818558},
        zoom: 11
    });

    // Deklarimi i nje markeri
    var marker = new google.maps.Marker({
        map: map,
        draggable: true
    });

    // Deklarimi i nje infowindow
    var infoWindow = new google.maps.InfoWindow({
        content: 'asdasd'
    });

    // Deklarimi i nje POLIGONI
    var polygon = new google.maps.Polygon({
        paths: polygonePoints,
        strokeColor: '#FF0000',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.2
    });

    var polyLine = new google.maps.Polyline({
        path: polylinesPoints,
        strokeColor: '#006B3C',
        strokeWeight: 2,
        strokeOpacity: 1.0
    });

    // MARKER
    document.getElementById('marker-button').addEventListener('click', function () {
        addMarker(marker, map, infoWindow);
        document.getElementById('delete-marker-button').style.display = 'block';
    });
    document.getElementById('delete-marker-button').addEventListener('click', function () {
        removeMarker(marker)
    });

    // POLYGON
    document.getElementById('polygon-button').addEventListener('click', function () {
        addPolygon(polygon, map);
        document.getElementById('delete-polygon-button').style.display = 'block';
    });
    document.getElementById('delete-polygon-button').addEventListener('click', function () {
        removePolygon(polygon)
    });

    // CIRCLE
    document.getElementById('circle-button').addEventListener('click', function () {
        addCircles(map);
        document.getElementById('delete-circle-button').style.display = 'block';
    });

    document.getElementById('delete-circle-button').addEventListener('click', function () {
        deleteCircles();
        document.getElementById('delete-circle-button').style.display = 'none';
    });
    
    // POLYLINE
    document.getElementById('polyline-button').addEventListener('click', function () {
        addPolyline(polyLine, map);
        document.getElementById('delete-polyline-button').style.display = 'block';
    });

    document.getElementById('delete-polyline-button').addEventListener('click', function () {
        deletePolyline(polyLine);
        document.getElementById('delete-polyline-button').style.display = 'none';
    })
}
/**
 * Get lat and lng from textbox and add a marker
 * @param marker
 * @param map
 */
var addMarker = function (marker, map, infoWindow) {
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var position = new google.maps.LatLng(lat, lng);
    marker.setPosition(position);
    marker.setMap(map);
    map.setCenter(position);
    infoWindow.setContent('<h5>Lat:' + lat + '</h5><h5>Lng:' + lng + '</h5>');
    infoWindow.open(map, marker);
};

var removeMarker = function (marker) {
    marker.setMap(null);
    document.getElementById('delete-marker-button').style.display = 'none';
};

var addPolygon = function (polygon, map) {
    polygon.setMap(map)
};

var removePolygon = function (polygon) {
    polygon.setMap(null);
    document.getElementById('delete-polygon-button').style.display = 'none';
};

var addCircles = function (map) {
    for (city in citymap) {
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeWeight: 2,
            strokeOpacity: 0.8,
            fillColor: '#FF0000',
            fillOpacity: 0.2,
            map: map,
            center: citymap[city].center,
            radius: Math.sqrt(citymap[city].population) * 100
        });
        circles.push(circle);
    }
};

var deleteCircles = function () {
    for (circle in circles) {
        circles[circle].setMap(null);
    }
};

var addPolyline = function (polyline, map) {
  polyline.setMap(map);  
};

var deletePolyline = function (polyline) {
    polyline.setMap(null)
};

/* Bejm trigger funksionin qe inicializon mapen */
google.maps.event.addDomListener(window, 'load', initMap);

