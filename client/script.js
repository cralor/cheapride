function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  from_address = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('from_address')),
      { types: ['geocode'] });
    to_address = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('to_address')),
        { types: ['geocode'] });
}

// [START region_fillform]
function sendLocationData(from_address, to_address) {
  // Get the place details from the autocomplete object.
  var from_place = from_address.getPlace();
    var to_place = to_address.getPlace();

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  var from_lng = from_place.geometry.location.getLng();
    var from_lat = from_place.geometry.location.getLat();
    var to_lng = to_place.geometry.location.getLng();
    var to_lat = to_place.geometry.location.getLat();

    $.ajax({
        url: "http://localhost:3000/getUberData",
        data: {
            fromLng: from_lng,
            fromLat: from_lat,
            toLng: to_lng,
            toLat: to_lat
        },
        success: function( data ) {
            $("a#uber").attr("href", "").html( "" );
        }
    });
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
