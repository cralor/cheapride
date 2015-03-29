// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  from_address = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('from_address')),
      { types: ['geocode'] });
    to_address = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('to_address')),
        { types: ['geocode'] });
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.
  google.maps.event.addListener(from_address, 'place_changed', function() {
    sendLocationData(from_address);
  });
    google.maps.event.addListener(to_address, 'place_changed', function() {
        sendLocationData(to_address);
    });
}

// [START region_fillform]
function sendLocationData(object) {
  // Get the place details from the autocomplete object.
  var place = object.getPlace();

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  // TODO new shit here
}
// [END region_fillform]

// [START region_geolocation]
// Bias the from_address object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      from_address.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]
