const userTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccess = document.querySelector(".grant-accessContainer");
const userInfoContainer = document.querySelector(".userInfoContainer");
const searchForm = document.querySelector("[searchFormContainer]");
const loadingScreen = document.querySelector(".loadingContainer")
const userContainer = document.querySelector(".super-container")

// initalising the variables

let currentTab = userTab;
currentTab.classList.add("current-tab");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
getfromSessionStroage();

function switchTab(clickedTab){
    if(currentTab !== clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            // Now active the search form
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // first check the local coordinates are their if then active userTab otherwise grantAccess

            getfromSessionStroage();

        }
    }
}

// i clicked on userTab (your weather)
userTab.addEventListener("click", () => {
    switchTab(userTab);
})

// i clicked on searchTab (search weather)
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getfromSessionStroage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderData(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        alert("cannot fetch data!");
    }
}

function renderData(weatherData){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const windspeed = document.querySelector(".wind");
    const humidity = document.querySelector(".humidity");
    const cloudiness = document.querySelector(".cloud");
    const temperature = document.querySelector(".temp");

    cityName.innerText = weatherData?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherData?.main?.temp} °C`;
    windspeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    cloudiness.innerText = `${weatherData?.clouds?.all}%`;
}


function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation not Supported");
    }

}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value == ""){
        return;
    }

    fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderData(data);
    }
    catch(err){
        alert("No city Found: ", cityName);
    }
}