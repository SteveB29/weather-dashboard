var searchForm = document.querySelector('#submit-button');
var previousCity = document.querySelector('#previous-cities');

var apiLocationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var apiKey = "&appid=aded44f82b44e0af228ba72e16261166";
var apiExclude = "&exclude=minutely,hourly"
var apiUnits = "&units=imperial"

var searchArray = [];


var locationTextGet = function(event) {
  event.preventDefault();
  var city = document.querySelector('#city-search');
  if (city.value) {
    locationFetch(city.value);
    city.value = "";
  } else {
    alert("Please enter a city");
  }
}

var previousLocation = function(event) {
  console.log(event.target.id);
  if (event.target.id === "previous-cities") {
    console.log('ignore click');
  } else {
    locationFetch(event.target.id);
  }
}

var locationFetch = function(cityName) {
  var locationUrl = apiLocationUrl + cityName + apiKey;
  fetch(locationUrl).then(function(response) {
    response.json().then(function(response) {
      if (response.length === 0) {
        alert("Please enter a valid city (type the name of the city only)");
      } else {
        var lat = response[0].lat;
        var lon = response[0].lon;
        var city = response[0].name;
        cityArrayAdd(city);
        weatherFetch(lat, lon, city);
      }
    });
  });
}

var weatherFetch = function(lat, lon, city) {
  var weatherUrl = apiWeatherUrl + 'lat=' + lat + '&lon=' + lon + apiUnits + apiExclude + apiKey;
  fetch(weatherUrl).then(function(response) {
    response.json().then(function(response) {
      var icon = response.current.weather[0].icon;
      var temp = response.current.temp;
      var wind = response.current.wind_speed;
      var humid = response.current.humidity;
      var uv = response.current.uvi;
      displayWeather(city, icon, temp, wind, humid, uv);
      fiveDayForecast(response.daily);
    })
  })
}

var displayWeather = function(city, icon, temp, wind, humid, uv) {
  // select current weather box and remove contents
  var weatherBox = document.querySelector('.current-weather');
  weatherBox.innerHTML = "";

  // create head elements
  var weatherDivEl = document.createElement('div');
  var weatherHeaderEl = document.createElement('h3');
  var iconDivEl = document.createElement('div');
  var iconImgEl = document.createElement('img');

  // create stats elements
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');

  // create uv index elements
  var uvDivEl = document.createElement('div');
  var uvPEl = document.createElement('p');
  var uvColorDivEl = document.createElement('div');
  var uvColorPEl = document.createElement('p');

  // set content and attributes of header elements
  weatherDivEl.className = "weather-header";
  weatherHeaderEl.innerText = city + " (" + dayjs().format('M/D/YYYY') + ")";
  iconImgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')

  // set content of stats elements
  tempEl.textContent = 'Temp: ' + temp + '°F';
  windEl.textContent = 'Wind: ' + wind + ' MPH';
  humidEl.textContent = 'Humidity: ' + humid + '%';

  // set content and attributs of uv elemts
  uvDivEl.className = 'uv-index';
  uvPEl.textContent = 'UV Index:';
  uvColorDivEl.className = 'uv-number';
  uvColorPEl.textContent = uv;
  if (uv >= 7) {
    uvColorPEl.className = 'high-index';
  } else if (uv >= 3) {
    uvColorPEl.className = 'moderate-index';
  } else {
    uvColorPEl.className = 'low-index';
  }

  // append the header elements
  iconDivEl.appendChild(iconImgEl);
  weatherDivEl.appendChild(weatherHeaderEl);
  weatherDivEl.appendChild(iconDivEl);
  weatherBox.appendChild(weatherDivEl);

  // append the stats elements
  weatherBox.appendChild(tempEl);
  weatherBox.appendChild(windEl);
  weatherBox.appendChild(humidEl);

  // append the uv elements
  uvColorDivEl.appendChild(uvColorPEl);
  uvDivEl.appendChild(uvPEl);
  uvDivEl.appendChild(uvColorDivEl);
  weatherBox.appendChild(uvDivEl);
}

var fiveDayForecast = function(forecast) {
  var forecastDiv = document.querySelector('#forecast-box');
  forecastDiv.innerHTML = '';

  for (var i = 1; i < 6 ; i++) {
    
    // create the elements for the five day forecast
    var fiveDayDivEl = document.createElement('div');
    var fiveDateEl = document.createElement('h4');
    var fiveImgEl = document.createElement('img');
    var fiveTempEl = document.createElement('p');
    var fiveWindEl = document.createElement('p');
    var fiveHumidEl = document.createElement('p');

    // set content and attributes
    fiveDayDivEl.className = 'col five-day-box';
    fiveDateEl.textContent = dayjs.unix(forecast[i].dt).format('M/D/YYYY');
    fiveImgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + forecast[i].weather[0].icon + '@2x.png')
    fiveTempEl.textContent = 'Temp: ' + forecast[i].temp.day + '°F';
    fiveWindEl.textContent = 'Wind: ' + forecast[i].wind_speed + ' MPH';
    fiveHumidEl.textContent = 'Humidity: ' + forecast[i].humidity + ' %';

    // append the content
    fiveDayDivEl.appendChild(fiveDateEl);
    fiveDayDivEl.appendChild(fiveImgEl);
    fiveDayDivEl.appendChild(fiveTempEl);
    fiveDayDivEl.appendChild(fiveWindEl);
    fiveDayDivEl.appendChild(fiveHumidEl);
    forecastDiv.appendChild(fiveDayDivEl);
  }
}

var previousCitySearchElAdd = function(city) {
  var previousCityEl = document.querySelector('#previous-cities');

  var newCityButton = document.createElement('button');
  newCityButton.className = 'btn btn-primary previous-button';
  newCityButton.textContent = city;
  newCityButton.id = city;
  previousCityEl.appendChild(newCityButton);
}

var cityArrayAdd = function(cityText) {
  if (!searchArray) {
    previousCitySearchElAdd(cityText);
    searchArray.push(cityText);
    localStorage.setItem('cities', JSON.stringify(searchArray));
  } else {
    let arrayCheck = 0;
    for (let i = 0 ; i < searchArray.length; i++) {
      if (searchArray[i] === cityText) {
        arrayCheck++;
      }
    }

    if (arrayCheck === 0) {
      previousCitySearchElAdd(cityText);
      searchArray.push(cityText)
      localStorage.setItem('cities', JSON.stringify(searchArray));
    }
  }
  console.log(searchArray);
}

var loadPreviousCities = function() {
  var previousArray = (JSON.parse(localStorage.getItem('cities')));

  if (previousArray) {
    searchArray = previousArray;
  }
  console.log(searchArray);

  if (searchArray) {
    for (let i = 0; i < searchArray.length; i++) {
      previousCitySearchElAdd(searchArray[i]);
    }
  }
}

loadPreviousCities();

searchForm.addEventListener('click', locationTextGet);
previousCity.addEventListener('click', previousLocation);