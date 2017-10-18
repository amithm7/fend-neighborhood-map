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

// Locations constructor
var Location = function(loc) {
    this.name = ko.observable(loc.name);
    this.location = ko.observable(loc.location);
    this.visible = ko.observable(true);
};

// Render map
var initMap = function () {
    var self = this;

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 12.936257, lng: 77.616959 },
        zoom: 16
    });

    // Map markers
    var markers = [];
    
    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].name;
        var position = locations[i].location;
        
        var marker = new google.maps.Marker({
            map: map,
            title: title,
            position: position,
            animation: google.maps.Animation.DROP
        });
        
        markers.push(marker);
        
        marker.addListener('click', function() {
            toggleBounce(this);
            self.curMarker = this;
        });    
    }

    // Currently clicked on marker, default as first one.
    this.curMarker = markers[0];

    // From maps JS API documentation
    function toggleBounce(marker) {
        // Clear animation from previous marker
        self.curMarker.setAnimation(null);

        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
};

// Map loading error
var mapError = function() {
    document.getElementById('map').innerHTML = "Error Loading Map. Try refreshing the page.";
};

// ViewModel
var ViewModel = function() {
    self = this;
    
    this.locations = ko.observableArray();

    locations.forEach(function(ele) {
        self.locations.push(new Location(ele));
    });

    this.toggleNav = function() {
        var sidebar = document.getElementsByClassName("sidebar")[0];
        var map = document.getElementById("map");
        if (sidebar.style.width == "250px") {
            sidebar.style.width = "0px";
            map.style.marginLeft = "0px";
        } else {
            sidebar.style.width = "250px";
            map.style.marginLeft = "250px";
        }
    };
};

ko.applyBindings(new ViewModel());
