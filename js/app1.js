
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");


const weather = {


};

weather.temperature = {
    unit : "celsius"
}


const KELVIN = 273;
// API KEY
const key = "d3665d8098c7bb709d15d1b5956eee8d";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});



//Alarm CLock.....

let currentTime = '';
const sound = new Audio('../sounds/sound.mp3');
sound.loop = true;

const formatDay = (index) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[index];
}

const formatNumber = (number) => {
  return number < 10 ? `0${number}` : number;
};

const displayDateTime = () => {
  const current = new Date();
  const day = formatDay(current.getDay());
  const date = formatNumber(current.getDate());
  const month = formatNumber(current.getMonth() + 1);
  const year = current.getFullYear();
  const displayedDate = document.getElementById("date");
  displayedDate.innerText = `${day}, ${month}/${date}/${year}`;

  const h = formatNumber(current.getHours());
  const m = formatNumber(current.getMinutes());
  const s = formatNumber(current.getSeconds());
  const displayedTime = document.getElementById("time");
  displayedTime.innerText = `${h}:${m}:${s}`;
  currentTime = displayedTime.innerText;
};

const addOptions = (field, range) => {
  const select = document.getElementById(`alarm-${field}`);
  for (i = 0; i < range; i++) {
    select.options[i] = new Option(formatNumber(i), i);
  }
}

addOptions("hour", 24);
addOptions("minute", 60);
addOptions("second", 60);

const getAlarmTime = () => {
  const hour = document.getElementById('alarm-hour');
  const minute = document.getElementById('alarm-minute');
  const second = document.getElementById('alarm-second');
  const h = formatNumber(hour.options[hour.selectedIndex].value);
  const m = formatNumber(minute.options[minute.selectedIndex].value);
  const s = formatNumber(second.options[second.selectedIndex].value);
  return `${h}:${m}:${s}`;
};

const startAlarm = () => {
  console.log(currentTime);
  console.log(getAlarmTime());
  document.getElementById('alarm-hour').disabled = true;
  document.getElementById('alarm-minute').disabled = true;
  document.getElementById('alarm-second').disabled = true;

  setInterval(() => {
    if (currentTime === getAlarmTime()) {
      sound.play();
      console.log("alarm time");
    }
  }, 1000);
};

const cancelAlarm = () => {
  document.getElementById('alarm-hour').disabled = false;
  document.getElementById('alarm-minute').disabled = false;
  document.getElementById('alarm-second').disabled = false;
  sound.pause();
};

document.addEventListener("DOMContentLoaded", () => {
  setInterval(displayDateTime, 1000);
});

document.getElementById("start").addEventListener("click", startAlarm);

document.getElementById("cancel").addEventListener("click", cancelAlarm);
