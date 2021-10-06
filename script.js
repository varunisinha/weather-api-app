'use strict';

//creating variables where we will store all the values we fetch through the API call
const searchBtn = document.querySelector('#searchBtn');
const cityname = document.querySelector('.cityName');
const date = document.querySelector('.date');
const inputCityName = document.querySelector('#inputCityName');
const weatherImage = document.querySelector('.weatherIcon');
const temp = document.querySelector('.temp');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const uvi = document.querySelector('.uvi');
const cardHeader = document.querySelector('.heading');
var today = new Date();
console.log(today);
const [day, month, year] = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
console.log(day, month, year);


var cityList = [];
var city_name;
localCityList();
currentCityWeather();
function renderCity() {
    const city_list = document.querySelector('#cityList');
    $("#cityList").empty();
    document.querySelector('#inputCityName').value = "";
    // document.createElement('hr');
    for (var i = 0; i < cityList.length; i++) {
        var newEl = document.createElement('div');
        newEl.classList.add("list-group-item", "list-group-item-action", "list-group-item-primary", "city");
        newEl.setAttribute("data-name", cityList[i]);
        newEl.innerHTML = cityList[i];
        city_list.prepend(newEl);
    }
}

function currentCityWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));
    console.log("storedWeather:" + storedWeather);
    if (storedWeather !== null) {
        displayWeather(storedWeather);
        displayFiveDayForecast(storedWeather);
    }
}

function localCityList() {
    var storedCities = JSON.parse(localStorage.getItem('cities'));
    if (storedCities != null) {
        cityList = storedCities;
        renderCity();
    }
    else {
        console.log("local Storage: ", storedCities);
        localStorage.setItem('cities', JSON.stringify(cityList));
        renderCity();
    }
}

// Search for a city on pressing Enter button
$("#inputCityName").keypress(function (e) {
    if (e.which == 13) {
        $("#searchBtn").click();
    }
})

searchBtn.addEventListener('click', function () {
    const cityName = document.querySelector('#inputCityName');
    var city_name = cityName.value.trim();
    console.log(city_name);
    if (city_name == "") {
        alert('Please Enter correct name!!!')
    }
    else if (cityList.length < 1) {
        cityList.push(city_name);
        console.log(cityList);
    }
    else if (cityList.length > 5) {
        cityList.shift();
        cityList.push(city_name);
        console.log(cityList);
    }
    else {
        cityList.push(city_name);
        console.log(cityList);
    }
    cityArray();
    localCurrentCity(city_name);
    localCityList();
    displayWeather(city_name);
    displayFiveDayForecast(city_name);
    location.reload();

})
function cityArray() {
    localStorage.setItem('cities', JSON.stringify(cityList));
}
function localCurrentCity(city_name) {
    localStorage.setItem("currentCity", JSON.stringify(city_name));
    // var currentCity = localStorage.getItem("currentCity");
}  
async function displayWeather(city_name) {
    let weatherdata = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=4dc887f6e7c1527d560c22dbcc3f958b`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var lat = data['coord']['lat'];
            var lon = data['coord']['lon'];
            var cityName = data['name'];
            cityname.innerHTML = cityName;
            date.innerHTML = `(${month}/${day}/${year})`;
            console.log(lat, lon);
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=4dc887f6e7c1527d560c22dbcc3f958b`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    var weatherIcon = data['current']['weather'][0]['icon'];
                    weatherImage.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    var tempValue = data['current']['temp'];
                    console.log(tempValue);
                    temp.innerHTML = `Temp: ${tempValue} °F`;
                    var windValue = data['current']['wind_speed'];
                    console.log(windValue);
                    wind.innerHTML = `Wind: ${windValue} MPH`;
                    var humidityValue = data['current']['humidity'];
                    console.log(humidityValue);
                    humidity.innerHTML = `Humidity: ${humidityValue} %`;
                    var uviValue = data['current']['uvi'];
                    console.log(uviValue);

                    //creating if/else statements to color the UVI index box
                    uvi.innerHTML = `UV Index: `;
                    var uvNumber = document.createElement('span');
                    if (uviValue > 0 && uviValue <= 2.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("low");
                    } else if (uviValue >= 3 && uviValue <= 5.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("moderate");
                    } else if (uviValue >= 6 && uviValue <= 7.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("high");
                    } else if (uviValue >= 8 && uviValue <= 10.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("vhigh");
                    } else {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("extreme");
                    }

                });
        });
}

async function displayFiveDayForecast(city_name) {



    cardHeader.innerHTML = '5-Day Forecast';
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=imperial&appid=195cc3727e4ef1bc0cb479c73303fdd4`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let myResponse = response.json();
    myResponse.then(data => {
        console.log('5-day: ', data);
        var forecastDiv = $("<div  id='fiveDayForecast'>");
        var forecastHeader = $("<h3 class='card-header border-secondary'>").text("5 Day Forecast");
        forecastDiv.append(forecastHeader);
        var cardDeck = $("<div  class='card-deck'>");
        forecastDiv.append(cardDeck);
        for (let i = 0; i < data.list.length; i += 8) {
            var forecastCard = $("<div class='card mb-3 mt-3'>");
            var cardBody = $("<div class='card-body d-block'>");
            var val = data['list'][i]['dt_txt'].slice(0, 10).split('-');
            // console.log(val);
            var [dd, mm, yyyy] = [val[2], val[1], val[0]];
            var formatedDate = `${dd}/${mm}/${yyyy}`;
            // console.log(val.slice(0, 10).split('-').join('/'));
            var forecastDate = $("<h5 class='card-title'>").text(formatedDate);

            cardBody.append(forecastDate);
            var getCurrentWeatherIcon = data['list'][i]['weather'][0]['icon'];
            // console.log(getCurrentWeatherIcon);
            var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
            cardBody.append(displayWeatherIcon);
            var getTemp = data['list'][i]['main']['temp'];
            var tempEl = $("<p class='card-text '>").text("Temp: " + getTemp + "° F");
            cardBody.append(tempEl);
            var getHumidity = data['list'][i]['main']['humidity'];
            var humidityEl = $("<p class='card-text'>").text("Humidity: " + getHumidity + "%");
            cardBody.append(humidityEl);
            var getWind = data['list'][i]['wind']['speed'];
            var windEl = $("<p class='card-text'>").text("Wind: " + getWind + "MPH");
            cardBody.append(windEl);
            forecastCard.append(cardBody);
            cardDeck.append(forecastCard);
        }
        $("#forecastContainer").html(forecastDiv);
    })
}

function historyDisplayWeather(city_name) {
    console.log(city_name);
    displayWeather(city_name);
    displayFiveDayForecast(city_name);
    console.log(city_name);

}
const storedCitiesList = document.querySelectorAll('.city');
console.log(storedCitiesList);
for (let i = 0; i < storedCitiesList.length; i++) {
    storedCitiesList[i].addEventListener('click', function (e) {
        e.preventDefault();
        historyDisplayWeather(storedCitiesList[i].getAttribute("data-name"));
    }, false)
}

