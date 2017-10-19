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
var Location = function(loc, i) {
    this.name = ko.observable(loc.name);
    this.location = ko.observable(loc.location);
    this.visible = ko.observable(true);
    this.id = i;
};

// Map markers
var markers = [];

// Render map
var initMap = function () {
    var self = this;

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 12.936257, lng: 77.616959 },
        zoom: 16
    });

    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Loops through locations
    locations.forEach(function (ele, i) {
        var title = locations[i].name;
        var position = locations[i].location;

        // Create markers
        var marker = new google.maps.Marker({
            map: map,
            title: title,
            position: position,
            animation: google.maps.Animation.DROP
        });

        // FOURSQUARE API
        var fsUrl = "https://api.foursquare.com/v2/venues/search";
        fsUrl += '?' + $.param({
            query: marker.title,
            near: "Koramangala",
            v: "20161016",
            client_id: "YMKN5DFXHGGJGKIH53RT554F2LDQC4FS2T5IBJSI5D5BQDLV",
            client_secret: "YDPKCF2OUNH03IAUIUELEWOHAFPJ4O2IZGEKWCY4ZTBTMZPX",
        });

        // API call to fetch details of the location
        $.getJSON(fsUrl, (function(marker){
            // Using concept of closures to pass current marker
            return function (result) {
                var venue = result.response.venues[0];
                var info = (venue.categories[0].name ? "<div> <b> Category: </b> " + venue.categories[0].name:"") + "</div>" +
                    (venue.contact.formattedPhone ? "<div> <b> Contact: </b> " + venue.contact.formattedPhone : "") + "</div>" +
                    (venue.location.formattedAddress ? "<div> <b> Address: </b> " + venue.location.formattedAddress : "") + "</div>" +
                    (venue.url ? "<div> <b> Website: </b> " + venue.url : "") + "</div>";

                marker.info = info;
            };
        })(marker)).fail((function(marker) {
            return function () {
                marker.info = "<div> Failed to retrieve more info from Foursquare </div>";
            };
        })(marker));

        // Push marker to array to access outside this scope
        markers.push(marker);

        // Do bounce animation and open infoWindow when clicking on the marker
        marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, infoWindow);
            self.curMarker = this;
        });
        // Extend bounds of the map for each marker
        bounds.extend(markers[i].position);
    });
    map.fitBounds(bounds, 70);

    // Currently selected marker, default as first one for toggling animation.
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

    // Show infoWindow on marker
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div><b>' + marker.title + '</b></div>' + marker.info);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed and stop animation.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
                marker.setAnimation(null);
            });
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

    locations.forEach(function(ele, i) {
        self.locations.push(new Location(ele, i));
    });

    // To toggle display of navigation sidebar
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

    // Filter search input
    this.filterLocations = ko.observable('');

    // Search function automatically called as it is computed based on an observable 'filterLocations'
    this.search = ko.computed(function() {
        var filter = self.filterLocations().toLowerCase();

        for(var i = 0; i < self.locations().length; i++) {
            var ele = self.locations()[i];

            // Checks if filter value matches with location name
            if(ele.name().toLowerCase().indexOf(filter) >= 0) {
                // Display list item
                ele.visible(true);
                // Check existence of marker and set it's visibility
                if (markers[i])
                    markers[i].setVisible(true);
            } else {
                ele.visible(false);
                if (markers[i])
                    markers[i].setVisible(false);
            }
        }
    });

    // Triggers a google map event when click on list item (Refered `this` here)
    // https://developers.google.com/maps/documentation/javascript/reference#event
    this.selectMarker = function() {
        google.maps.event.trigger(markers[this.id], 'click');
    };
};

ko.applyBindings(new ViewModel());
