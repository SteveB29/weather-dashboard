var searchForm = document.querySelector('#submit-button');

var apiLocationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var apiKey = "&appid=aded44f82b44e0af228ba72e16261166";
// var cityName = "New Milford,CT,US"
var apiExclude = "&exclude=minutely,hourly"


var locationTextGet = function(event) {
  event.preventDefault();
  var city = document.querySelector('#city-search');
  console.log(dayjs().format('D/M/YYYY'));
  if (city.value) {
    locationFetch(city.value);
    city.value = "";
  } else {
    alert("Please enter a city");
  }
}

var locationFetch = function(cityName) {
  var locationUrl = apiLocationUrl + cityName + apiKey;
  fetch(locationUrl).then(function(response) {
    response.json().then(function(response) {

      if (response.length === 0) {
        alert("Please enter a valid city");
      } else {
        console.log(response);
        var lat = response[0].lat;
        var lon = response[0].lon;
        displayWeather(response[0].name);
        weatherFetch(lat, lon);
      }
    });
  });
}

var weatherFetch = function(lat, lon) {
  var weatherUrl = apiWeatherUrl + 'lat=' + lat + '&lon=' + lon + apiExclude + apiKey;
  console.log(weatherUrl);
  fetch(weatherUrl).then(function(response) {
    response.json().then(function(response) {
      console.log(response);
    })
  })
}

var displayWeather = function(city) {
  var weatherBox = document.querySelector('.current-weather');
  var weatherHeader = document.createElement('h3');
  weatherHeader.innerText = city + " (" + dayjs().format('D/M/YYYY') + ")";
  console.log(weatherHeader);
  weatherBox.appendChild(weatherHeader);

}

searchForm.addEventListener('click', locationTextGet);