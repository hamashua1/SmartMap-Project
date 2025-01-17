const map = L.map("map").setView([20, 0], 2);

// OpenWeatherMap API key
const WEATHER_API_KEY = '1635890035cbba097fd5c26c8ea672a1';

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18
}).addTo(map);

async function getWeatherInfo(lat, lon) {
    if (WEATHER_API_KEY === 'YOUR_API_KEY') {
        console.error('Please set your OpenWeatherMap API key in the script.js file');
        return null;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function getCountryInfo(latlng) {
    try {
        const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${latlng.country}`);
        if (!countryResponse.ok) {
            throw new Error(`Country API error: ${countryResponse.status}`);
        }
        
        const weatherData = await getWeatherInfo(latlng.lat, latlng.lng);
        const [data] = await countryResponse.json();
        
        let weatherHtml = '';
        if (weatherData) {
            weatherHtml = `
                <div class="weather-info">
                    <h3>Current Weather</h3>
                    <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>
                    <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather icon">
                </div>
            `;
        } else {
            weatherHtml = `
                <div class="weather-info error">
                    <p>⚠️ Weather data unavailable. Please check the console for details.</p>
                </div>
            `;
        }
        
        const popup = L.popup()
            .setLatLng(latlng)
            .setContent(`
                <div class="country-popup">
                    <h2>${data.name.common}</h2>
                    <img src="${data.flags.png}" alt="${data.name.common} flag" onerror="this.src='https://via.placeholder.com/150x100?text=Flag+Not+Found'">
                    <div class="country-info">
                        <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
                        <p><strong>Capital:</strong> ${data.capital?.[0] || "N/A"}</p>
                        <p><strong>Region:</strong> ${data.region}</p>
                        <p><strong>Languages:</strong> ${Object.values(data.languages || {}).join(", ") || "N/A"}</p>
                        <p><strong>Currencies:</strong> ${Object.values(data.currencies || {}).map(curr => `${curr.name} (${curr.symbol})`).join(", ") || "N/A"}</p>
                    </div>
                    ${weatherHtml}
                </div>
            `);
        
        popup.openOn(map);
    } catch (error) {
        console.error("Error fetching data:", error);
        const popup = L.popup()
            .setLatLng(latlng)
            .setContent(`
                <div class="country-popup error">
                    <p>⚠️ Error loading country data. Please try again.</p>
                </div>
            `);
        popup.openOn(map);
    }
}

async function onMapClick(e) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.address && data.address.country_code) {
            getCountryInfo({
                ...e.latlng,
                country: data.address.country_code.toUpperCase()
            });
        } else {
            throw new Error('No country found at this location');
        }
    } catch (error) {
        console.error("Error getting location data:", error);
        const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`
                <div class="country-popup error">
                    <p>⚠️ Could not find country at this location.</p>
                </div>
            `);
        popup.openOn(map);
    }
}

map.on("click", onMapClick);
