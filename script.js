// Weather API Configuration
const API_KEY = 'demo'; // Replace with your own API key from openweathermap.org
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const AIR_QUALITY_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Default cities for suggestions
const DEFAULT_CITIES = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Sydney',
    'Dubai',
    'Singapore',
    'Toronto'
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsDiv = document.getElementById('suggestions');
const currentWeatherDiv = document.getElementById('currentWeather');
const mainContent = document.getElementById('mainContent');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const lastUpdate = document.getElementById('lastUpdate');

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadDefaultSuggestions();
    // Load weather for a default city
    fetchWeatherByCity('London');
});

// Load default city suggestions
function loadDefaultSuggestions() {
    suggestionsDiv.innerHTML = '';
    DEFAULT_CITIES.forEach(city => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.textContent = city;
        suggestion.addEventListener('click', () => {
            searchInput.value = city;
            fetchWeatherByCity(city);
        });
        suggestionsDiv.appendChild(suggestion);
    });
}

// Search weather
function searchWeather() {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    try {
        showLoading();
        hideError();

        // If using demo mode, show a notice
        if (API_KEY === 'demo') {
            showDemoMessage();
            return;
        }

        // Get coordinates from city name
        const geoResponse = await fetch(
            `${GEOCODING_API_URL}?q=${city}&limit=1&appid=${API_KEY}`
        );

        if (!geoResponse.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
            throw new Error('City not found');
        }

        const { lat, lon } = geoData[0];
        await Promise.all([
            fetchCurrentWeather(lat, lon),
            fetchForecast(lat, lon),
            fetchAirQuality(lat, lon)
        ]);
    } catch (error) {
        showError(error.message || 'Failed to fetch weather data');
        console.error('Error:', error);
    }
}

// Fetch current weather
async function fetchCurrentWeather(lat, lon) {
    const response = await fetch(
        `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    displayCurrentWeather(data);
}

// Fetch forecast
async function fetchForecast(lat, lon) {
    const response = await fetch(
        `${FORECAST_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    displayForecast(data);
}

// Fetch air quality
async function fetchAirQuality(lat, lon) {
    const response = await fetch(
        `${AIR_QUALITY_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();
    displayAirQuality(data);
}

// Display current weather
function displayCurrentWeather(data) {
    const { main, weather, wind, visibility, sys } = data;
    
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('temperature').textContent = Math.round(main.temp);
    document.getElementById('feelsLike').textContent = Math.round(main.feels_like);
    document.getElementById('description').textContent = weather[0].main + ' - ' + weather[0].description;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(wind.speed * 3.6)} km/h`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('maxTemp').textContent = `${Math.round(main.temp_max)}°C`;
    document.getElementById('minTemp').textContent = `${Math.round(main.temp_min)}°C`;
    
    // Weather icon
    const iconCode = weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    document.getElementById('weatherIcon').alt = weather[0].description;
    
    updateLastUpdate();
    showContent();
}

// Display forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    // Get forecast for every 24 hours (every 8th item in 3-hour forecast)
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });
    
    // Display next 5 days
    Object.entries(dailyForecasts).slice(0, 5).forEach(([date, forecast]) => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const forecastDate = new Date(forecast.dt * 1000);
        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        card.innerHTML = `
            <div class="forecast-date">${dayName}, ${dateStr}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temp">
                <span class="forecast-temp-max">${Math.round(forecast.main.temp_max)}°</span>
                <span class="forecast-temp-min">${Math.round(forecast.main.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${forecast.weather[0].main}</div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

// Display air quality
function displayAirQuality(data) {
    const { main, components } = data;
    const aqi = main.aqi;
    
    // AQI levels
    const aqiLevels = {
        1: { label: 'Good', color: '#00e400', bg: '#e8f5e9' },
        2: { label: 'Fair', color: '#ffff00', bg: '#fffde7' },
        3: { label: 'Moderate', color: '#ff7e00', bg: '#fff3e0' },
        4: { label: 'Poor', color: '#ff0000', bg: '#ffebee' },
        5: { label: 'Very Poor', color: '#8f0000', bg: '#fce4ec' }
    };
    
    const level = aqiLevels[aqi] || aqiLevels[1];
    
    document.getElementById('aqiValue').textContent = aqi;
    document.getElementById('aqiValue').style.background = level.color;
    document.getElementById('aqiValue').style.color = aqi <= 2 ? '#333' : 'white';
    document.getElementById('aqiLabel').textContent = level.label;
    
    // Update pollutant values
    document.getElementById('pm25').textContent = `${Math.round(components.pm2_5)} μg/m³`;
    document.getElementById('pm10').textContent = `${Math.round(components.pm10)} μg/m³`;
    document.getElementById('no2').textContent = `${Math.round(components.no2)} μg/m³`;
    document.getElementById('o3').textContent = `${Math.round(components.o3)} μg/m³`;
}

// Show demo message
function showDemoMessage() {
    showContent();
    showError('⚠️ Demo Mode: Using sample data. To use real weather data, replace API_KEY with your OpenWeatherMap API key (free tier available at openweathermap.org)');
    
    // Display sample data
    const sampleData = {
        name: 'London',
        sys: { country: 'GB' },
        main: {
            temp: 15,
            feels_like: 13,
            humidity: 72,
            pressure: 1013,
            temp_max: 18,
            temp_min: 12
        },
        weather: [{ main: 'Partly Cloudy', description: 'partly cloudy', icon: '02d' }],
        wind: { speed: 4.5 },
        visibility: 10000
    };
    
    displayCurrentWeather(sampleData);
    
    // Sample forecast
    const sampleForecast = {
        list: [
            { dt: Math.floor(Date.now() / 1000) + 86400, main: { temp_max: 18, temp_min: 12 }, weather: [{ icon: '02d', main: 'Partly Cloudy' }] },
            { dt: Math.floor(Date.now() / 1000) + 172800, main: { temp_max: 16, temp_min: 11 }, weather: [{ icon: '03d', main: 'Cloudy' }] },
            { dt: Math.floor(Date.now() / 1000) + 259200, main: { temp_max: 17, temp_min: 10 }, weather: [{ icon: '09d', main: 'Rainy' }] },
            { dt: Math.floor(Date.now() / 1000) + 345600, main: { temp_max: 19, temp_min: 13 }, weather: [{ icon: '01d', main: 'Sunny' }] },
            { dt: Math.floor(Date.now() / 1000) + 432000, main: { temp_max: 20, temp_min: 14 }, weather: [{ icon: '02d', main: 'Partly Cloudy' }] }
        ]
    };
    
    displayForecast(sampleForecast);
}

// Show loading state
function showLoading() {
    currentWeatherDiv.style.display = 'block';
    mainContent.style.display = 'none';
}

// Show content
function showContent() {
    currentWeatherDiv.style.display = 'none';
    mainContent.style.display = 'block';
}

// Show error
function showError(message) {
    errorMessage.style.display = 'block';
    errorText.textContent = message;
    currentWeatherDiv.style.display = 'none';
}

// Hide error
function hideError() {
    errorMessage.style.display = 'none';
}

// Update last update time
function updateLastUpdate() {
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}