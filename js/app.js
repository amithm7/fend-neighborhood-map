// Neighborhood Locations
var locations = [
    { name: "Social (Restaurant)", location: { lat: 12.935421, lng: 77.614167 } },
    { name: "The Hole In the Wall Cafe (Restaurant)", location: { lat: 12.934605, lng: 77.625542 } },
    { name: "Momoz (Restaurant)", location: { lat: 12.935942, lng: 77.616141 } },
    { name: "Truffles (Restaurant)", location: { lat: 12.933491, lng: 77.614285 } },
    { name: "Burger King (Restaurant)", location: { lat: 12.935075, lng: 77.613275 } },
    { name: "Taco Bell (Restaurant)", location: { lat: 12.937575, lng: 77.626904 } },
    { name: "KFC (Restaurant)", location: { lat: 12.934271, lng: 77.610875 } },
    { name: "The Local (Pub)", location: { lat: 12.940712, lng: 77.624389 } },
    { name: "Sapna Book House", location: { lat: 12.936312, lng: 77.616288 } },
    { name: "Jyoti Nivas College", location: { lat: 12.932721, lng: 77.616939 } },
    { name: "Koramangala Police Station", location: { lat: 12.94131, lng: 77.621029 } },
];

// Render map
var initMap = function () {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 12.936257, lng: 77.616959 },
        zoom: 16
    });
};

// Map loading error
var mapError = function() {
    document.getElementById('map').innerHTML = "Error Loading Map. Try refreshing the page.";
};
