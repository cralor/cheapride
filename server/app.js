var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

var version = "v0.1";

console.log("CheapRide app loaded. Running " + version + ". Have fun!");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

function getUberPrice(start_lat, start_lon, end_lat, end_lon, Uber, callback) {
    var uber_price = 0;
    var uber_length = 0;
    var uber_distance = 0;

    Uber.getPriceEstimate(start_lat, start_lon, end_lat, end_lon, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
            for (var i = 0; i < response.prices.length; i++) {
                if (response.prices[i].display_name === "uberX") {
                    uber_price = (response.prices[i].low_estimate + response.prices[i].high_estimate) / 2;
                    uber_length += Math.floor(response.prices[i].duration / 60);
                    uber_distance = response.prices[i].distance;
                    callback(error, uber_price, uber_length, uber_distance);
                    break;
                }
            }
        }
    });
}

function getUberETA(start_lat, start_lon, Uber, callback) {
    Uber.getTimeEstimate(start_lat, start_lon, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
            for (var i = 0; i < response.times.length; i++) {
                if (response.times[i].display_name === "uberX") {
                    callback(error, Math.floor(response.times[i].estimate / 60))
                    break;
                }
            }
        }
    });
}

app.get('/getUberData', function (req, res) {

    var Uber = require('uber-api')({server_token:'m1qd5wd_YZH10gE3shsv3vPqjBp9eYmzCIZuQcAp',version:'v1'}),
        start_lat = parseFloat(req.query.fromLat),
        start_lon = parseFloat(req.query.fromLng),
        end_lat = parseFloat(req.query.toLat),
        end_lon = parseFloat(req.query.toLng);

    getUberPrice(start_lat, start_lon, end_lat, end_lon, Uber, function(priceError, price, length, distance) {
        getUberETA(start_lat, start_lon, Uber, function(etaError, eta) {
            if (priceError || etaError) {
                res.end(500);
            } else {
                var response = JSON.stringify({ "price": "$"+price.toFixed(2), "eta": eta, "total_time:": length+eta, "distance": distance});
                console.log(response);
                res.end(response);
            }
        });
    });
});

app.listen(3000);