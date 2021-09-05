var searchForm = document.querySelector('#submit-button');
var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiKey = "&appid=aded44f82b44e0af228ba72e16261166";
// var cityName = "New Milford,CT,US"
var apiExclude = "&exclude=minutely,hourly"

var locationFetch = function() {
  var apiLookup = apiUrl + cityName + apiKey;
  console.log(apiLookup);
  fetch(apiLookup).then(function(response) {
    response.json().then(function(response) {
      console.log(response);
    });
  });
}

var locationGet = function(event) {
  event.preventDefault();
  var city = document.querySelector('#city-search');
  console.log(city.value);
  city.value = "";
}

// locationFetch();

searchForm.addEventListener('click', locationGet);