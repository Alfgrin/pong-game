# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API. Get comprehensive weather information, 5-day forecasts, and air quality data for any city in the world.

## 🌟 Features

✨ **Real-Time Weather Data** - Current conditions, temperature, humidity, wind speed, and more
📅 **5-Day Forecast** - View upcoming weather predictions
🌍 **Worldwide Coverage** - Search weather for any city globally
💨 **Air Quality Index (AQI)** - Monitor air pollution levels and pollutants (PM2.5, PM10, NO₂, O₃)
🎨 **Beautiful UI** - Modern, responsive design with smooth animations
📱 **Mobile Friendly** - Fully responsive on all devices
🔍 **Quick Search** - Suggested cities for quick access
⏱️ **Last Updated** - Shows when data was last refreshed

## 📋 Weather Information Displayed

### Current Weather
- Temperature (Celsius)
- "Feels Like" temperature
- Weather condition (e.g., Cloudy, Rainy)
- Humidity percentage
- Wind speed (km/h)
- Atmospheric pressure (hPa)
- Visibility (km)
- Max and Min temperatures

### 5-Day Forecast
- Daily high and low temperatures
- Weather icons
- Weather description
- Date and day of week

### Air Quality
- AQI Index (1-5 scale)
- AQI Level (Good, Fair, Moderate, Poor, Very Poor)
- PM2.5 concentration
- PM10 concentration
- NO₂ concentration
- O₃ concentration

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

1. **Get a Free API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Go to your API keys section
   - Copy your API key

2. **Update the API Key**
   - Open `script.js`
   - Find the line: `const API_KEY = 'demo';`
   - Replace `'demo'` with your actual API key: `const API_KEY = 'your_api_key_here';`

3. **Open the Dashboard**
   - Open `index.html` in your web browser
   - The dashboard will load with weather data

### Demo Mode
If you don't have an API key yet, the application runs in **Demo Mode** by default, showing sample weather data for London. Replace the API key to use real data.

## 💻 Usage

1. **Search for a City**
   - Type a city name in the search box
   - Press Enter or click the Search button
   - The dashboard updates with weather for that city

2. **Quick City Selection**
   - Click on any suggested city from the list below the search bar
   - Weather data loads instantly

3. **View Details**
   - Scroll down to see the 5-day forecast
   - Check the air quality section for pollution levels
   - All data updates in real-time

## 🛠️ File Structure

```
weather-dashboard/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # JavaScript logic and API calls
└── README.md       # Documentation
```

## 🔧 Technical Details

### APIs Used
- **Weather Data**: OpenWeatherMap Current Weather API
- **Forecast**: OpenWeatherMap 5-Day Forecast API
- **Geocoding**: OpenWeatherMap Geocoding API
- **Air Quality**: OpenWeatherMap Air Pollution API

### Libraries & Resources
- Font Awesome Icons (CDN)
- Vanilla JavaScript (ES6+)
- CSS Grid & Flexbox
- Fetch API for HTTP requests

## 🎨 Customization

### Change Default Cities
Edit the `DEFAULT_CITIES` array in `script.js`:
```javascript
const DEFAULT_CITIES = [
    'London',
    'New York',
    'Tokyo',
    // Add or replace cities here
];
```

### Change Color Scheme
Modify the gradient and color variables in `style.css`:
- Primary gradient: `#667eea` to `#764ba2`
- Accent color: `#667eea`

### Change Temperature Unit
In `script.js`, change `units=metric` to `units=imperial` for Fahrenheit

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 API Information

### Free Tier Limitations
- 60 calls/minute
- 1,000,000 calls/month
- Current weather + 5-day forecast included
- Air quality data included

### Response Time
Typically 200-500ms per request

## 🐛 Troubleshooting

### "City not found" Error
- Check spelling of the city name
- Use city names with countries if ambiguous (e.g., "London, UK")
- Try alternative names

### "Failed to fetch weather data" Error
- Verify your API key is correct
- Check internet connection
- Ensure API key has appropriate permissions
- API key might be inactive (check OpenWeatherMap dashboard)

### Demo Data Shows Instead of Real Data
- Replace `API_KEY = 'demo'` with your actual API key
- Check that the key is active in your OpenWeatherMap account

## 📚 Additional Resources

- [OpenWeatherMap Documentation](https://openweathermap.org/api)
- [OpenWeatherMap FAQ](https://openweathermap.org/faq)
- [Weather Icons Reference](https://openweathermap.org/weather-conditions)

## 📄 License

This project is open source and available under the MIT License.

## 🙌 Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Design inspiration from modern dashboard UX patterns

## 🚀 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Location-based weather (geolocation)
- [ ] Weather alerts and warnings
- [ ] Weather history graph
- [ ] Multiple city comparison
- [ ] Local storage for favorite cities
- [ ] Weather maps integration
- [ ] Hourly forecast view

Enjoy your weather dashboard! 🌤️