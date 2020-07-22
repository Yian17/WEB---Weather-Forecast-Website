
//This test is used to make sure that the data we fetched from third-party api comes as the way we think, 
//if some part we used in our api have been changed, this test should not pass.
 
const assert = require('assert');
var request = require('request');


const head = 'https://query.yahooapis.com/v1/public/yql?q=';
const woeid = 'select woeid from geo.places(1) where text="';
const allDataOfWoeid = 'select * from weather.forecast where woeid in (';
const tail = '")&format=json';

var url = head + allDataOfWoeid + woeid + "Toronto" + tail;

var pulledData = [];

describe('check raw data quality', function(){
	before(function(){
		pulledData=(function(){
			return new Promise(function (resolve, reject){
				request(url, function (err, res, body) {
					if (err) {
						return reject(err);
					} else if (res.statusCode !== 200) {
						err = new Error("Unexpected status code when fetch data: " + res.statusCode);
						return reject(err);
					} else {
						var fullData = JSON.parse(body);
						return resolve(fullData);
					}
				});
			})
		})();
	});


	it ('result', function() {
		return pulledData.then(function(data){
			var temp = data.query.results!=null;
			assert.equal(temp,true);
		})
		
			
	});

	it ('all properties', function() {
		var expected = ["units", "location", "wind", "atmosphere", "astronomy", "image", "item"];
		
		return pulledData.then(function(data){
			data = data.query.results.channel;
			expected.map(prop=>{
				assert.equal(data.hasOwnProperty(prop),true);
			})
		})
		
	})

	it ('- 10 day forecast', function() {
		var expected = 10;
		return pulledData.then(function(data){
			data = data.query.results.channel.item.forecast;
			var forecastSize = data.length;
			assert.equal(forecastSize, expected);
		})
	})

	it ('- location', function() {
		var expected = ["city", "country", "region"];
		return pulledData
		.then(function(data){
			data = data.query.results.channel;
			var properties = Object.getOwnPropertyNames(data.location);
			assert.deepEqual(properties, expected);
		})
	})

	it ('- wind', function() {
		var expected_properties = ["chill", "direction", "speed"];
		return pulledData
		.then(function(data){
			data = data.query.results.channel;

			var properties = Object.getOwnPropertyNames(data.wind);
			assert.deepEqual(properties, expected_properties);

			var direction = data.wind.direction;
			var direction_match = direction.match("^[0-9]+$");
			assert.notEqual(direction_match, null);
		})
	})

})