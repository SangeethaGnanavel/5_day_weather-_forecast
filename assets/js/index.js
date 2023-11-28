let searchbtn = document.querySelector(".btn-search");
let cityName = document.querySelector("#cityname");
let displaycity = document.querySelector(".current-city");
let currentTemp = document.querySelector(".current-temp");
let currentWind = document.querySelector(".current-wind");
let currentHumidity = document.querySelector(".current-humidity");
let weatherIcon = document.getElementById("wicon");
let forecastContainer = document.querySelector(".forecast-container");
let listCitiesul = document.querySelector(".list-cities");
let currentweathercontainer = document.querySelector(".current-weather");

apiKey = "77ddd23344c52a9be8cb0d28ce8c4881"; //Name :San_Weather
let latitude = "";
let longitude = "";
var today = dayjs();
currentweathercontainer.setAttribute("style", "background-color:#3A475C");
currentTemp.setAttribute("style", "color:white");
currentWind.setAttribute("style", "color:white");
currentHumidity.setAttribute("style", "color:white");

//Function to display current weather
function CurrentForecastToday(event) {
  event.preventDefault();

  if (event.target.tagName == "LI") {
    cityName.value = event.target.textContent;
  }
  //clear previous search data
  displaycity.textContent = "";
  currentTemp.textContent = "";
  currentWind.textContent = "";
  currentHumidity.textContent = "";

  let apiToday =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName.value +
    "&appid=77ddd23344c52a9be8cb0d28ce8c4881";
  fetch(apiToday).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        weatherIcon.setAttribute(
          "src",
          "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );

        displaycity.textContent +=
          data.name + " (" + today.format("MM/DD/YYYY") + ")";

        currentTemp.textContent =
          "Temp : " +
          Math.round(data.main.temp - 273.15, 0) +
          String.fromCharCode(0x00b0) +
          "C";
        currentWind.textContent =
          "Wind : " + Math.round(data.wind.speed * 2.237, 2) + "MPH";
        currentHumidity.textContent = "Humidity : " + data.main.humidity + "%";
      });
    }
  });

  GetLatitudeLongitude(cityName.value);
}

//Function to get latitude and longitude to be used in weather Api for 5 day forecast
function GetLatitudeLongitude(city) {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=5&appid=" +
      apiKey
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayForecastWeather(data);
        return;
      });
    }
  });
}

//Fucntion to display 5 day weather forecast for selected city
function displayForecastWeather(data) {
  while (forecastContainer.firstChild) {
    forecastContainer.removeChild(forecastContainer.firstChild);
  }
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      data[0].lat +
      "&lon=" +
      data[0].lon +
      "&appid=" +
      apiKey
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (weatherdata) {
        //remove element created from previous search
        console.log(weatherdata);
        for (var i = 0; i < weatherdata.cnt; i = i + 8) {
          var forecastCard = document.createElement("div");
          forecastCard.classList = "card col-2";
          forecastCard.setAttribute("style", "background-color:#3A475C");

          var cardhead = document.createElement("h3");
          cardhead.classList = "card-header text-uppercase";
          cardhead.setAttribute("style", "color:white");
          cardhead.textContent = weatherdata.list[i].dt_txt.split(" ")[0];
          var tempIcon = document.createElement("img");
          tempIcon.setAttribute(
            "src",
            "http://openweathermap.org/img/w/" +
              weatherdata.list[i].weather[0].icon +
              ".png"
          );
          var temp = document.createElement("p");
          temp.setAttribute("style", "color:white");
          temp.textContent =
            "Temp : " +
            Math.round(weatherdata.list[i].main.temp - 273.15, 0) +
            String.fromCharCode(0x00b0) +
            "C";
          var wind = document.createElement("p");
          wind.setAttribute("style", "color:white");
          wind.textContent =
            "Wind : " +
            Math.round(weatherdata.list[i].wind.speed * 2.237, 2) +
            " MPH";
          var humidity = document.createElement("p");
          humidity.setAttribute("style", "color:white");
          humidity.textContent =
            "Humidity : " + weatherdata.list[i].main.humidity + " %";

          forecastCard.appendChild(cardhead);
          forecastCard.appendChild(tempIcon);
          forecastCard.appendChild(temp);
          forecastCard.appendChild(wind);
          forecastCard.appendChild(humidity);
          forecastContainer.appendChild(forecastCard);
        }
      });
    }
  });

  saveCitytoLocalstoarge(cityName.value);
}
//Function to store the city in local storage
function saveCitytoLocalstoarge(city) {
  var citysearched = [];
  let uniquecitysearched = [];

  citysearched = JSON.parse(localStorage.getItem("citysearched")) || [];
  citysearched.push(city);
  //Save unique cities
  citysearched.forEach((element) => {
    if (!uniquecitysearched.includes(element)) {
      uniquecitysearched.push(element);
    }
  });

  localStorage.setItem("citysearched", JSON.stringify(uniquecitysearched));
}

//Function that displays cities from local storage on form load
function searchHistory() {
  while (listCitiesul.firstChild) {
    listCitiesul.removeChild(listCitiesul.firstChild);
  }
  // Display from SearchHistory/localstorage
  var cityhistory = JSON.parse(localStorage.getItem("citysearched")) || [];
  for (let i = 0; i <= cityhistory.length - 1; i++) {
    var listCitiesli = document.createElement("li");
    listCitiesli.setAttribute("name", cityhistory[i]);
    listCitiesli.setAttribute("style", "list-style: none");
    listCitiesli.textContent = cityhistory[i];
    listCitiesul.appendChild(listCitiesli);
  }
}
listCitiesul.addEventListener("click", CurrentForecastToday);
searchbtn.addEventListener("click", CurrentForecastToday);
searchHistory();
