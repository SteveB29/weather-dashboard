var searchForm = document.querySelector('#submit-button');

var apiLocationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var apiKey = "&appid=aded44f82b44e0af228ba72e16261166";
// var cityName = "New Milford,CT,US"
var apiExclude = "&exclude=minutely,hourly"
var apiUnits = "&units=imperial"


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
        var city = response[0].name;
        weatherFetch(lat, lon, city);
      }
    });
  });
}

var weatherFetch = function(lat, lon, city) {
  var weatherUrl = apiWeatherUrl + 'lat=' + lat + '&lon=' + lon + apiUnits + apiExclude + apiKey;
  console.log(weatherUrl);
  fetch(weatherUrl).then(function(response) {
    response.json().then(function(response) {
      console.log(response);
      var icon = response.current.weather[0].icon;
      displayWeather(city, icon);
    })
  })
}

var displayWeather = function(city, icon) {
  // select current weather box and remove contents
  var weatherBox = document.querySelector('.current-weather');
  weatherBox.innerHTML = "";

  // create elements
  var weatherDivEl = document.createElement('div');
  var weatherHeaderEl = document.createElement('h3');
  var iconDivEl = document.createElement('div');
  var iconImgEl = document.createElement('img');

  // set content and attributes of elements
  weatherDivEl.className = "weather-header";
  weatherHeaderEl.innerText = city + " (" + dayjs().format('D/M/YYYY') + ")";
  iconImgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')

  // append the elements
  iconDivEl.appendChild(iconImgEl);
  weatherDivEl.appendChild(weatherHeaderEl);
  weatherDivEl.appendChild(iconDivEl);
  weatherBox.appendChild(weatherDivEl);

}

searchForm.addEventListener('click', locationTextGet);