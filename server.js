const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Enable CORS for all routes with proper configuration
app.use(cors({
    origin: ['http://localhost:8000', 'http://0.0.0.0:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Load and transform the country data
const rawCountries = JSON.parse(fs.readFileSync(path.join(__dirname, 'countries.json'), 'utf-8'));
console.log(`Loaded ${rawCountries.length} countries from file`);

const countries = rawCountries.map(country => {
    // Population data from World Bank 2021 estimates (or latest available)
    const populationData = {
        'China': 1412360000,
        'India': 1380004385,
        'United States': 331002651,
        'Indonesia': 273523615,
        'Pakistan': 220892340,
        'Brazil': 212559417,
        'Nigeria': 206139589,
        'Bangladesh': 164689383,
        'Russia': 144104080,
        'Mexico': 128932753,
        'Japan': 125836021,
        'Ethiopia': 114963588,
        'Philippines': 109581078,
        'Egypt': 102334404,
        'Vietnam': 97338579,
        'DR Congo': 89561403,
        'Turkey': 84339067,
        'Iran': 83992949,
        'Germany': 83240525,
        'Thailand': 69799978,
        'United Kingdom': 67215293,
        'France': 67391582,
        'Italy': 59554023,
        'South Africa': 59308690,
        'Tanzania': 59734218,
        'Myanmar': 54409800,
        'Kenya': 53771296,
        'South Korea': 51269185,
        'Colombia': 50882891,
        'Spain': 47351567,
        'Argentina': 45195774,
        'Algeria': 44616624,
        'Sudan': 43849260,
        'Ukraine': 44134693,
        'Uganda': 45741007,
        'Iraq': 40462701,
        'Poland': 37846611,
        'Canada': 38005238,
        'Morocco': 36910560,
        'Saudi Arabia': 34813871,
        'Uzbekistan': 34915100,
        'Peru': 32971854,
        'Angola': 32866272,
        'Malaysia': 32365999,
        'Ghana': 31072940,
        'Mozambique': 31255435,
        'Yemen': 29825964,
        'Nepal': 29136808,
        'Venezuela': 28435943,
        'Madagascar': 27691018,
        'Cameroon': 26545863,
        'Côte d\'Ivoire': 26378274,
        'North Korea': 25778816,
        'Australia': 25499884,
        'Niger': 24206644,
        'Taiwan': 23816775,
        'Sri Lanka': 22156000,
        'Burkina Faso': 20903273,
        'Mali': 20250833,
        'Romania': 19237691,
        'Chile': 19116201,
        'Kazakhstan': 18776707,
        'Zambia': 18383955,
        'Guatemala': 16858333,
        'Ecuador': 17643054,
        'Syria': 17500658,
        'Netherlands': 17134872,
        'Senegal': 16743927,
        'Cambodia': 16718965,
        'Chad': 16425864,
        'Somalia': 15893222,
        'Zimbabwe': 14862924,
        'Guinea': 13132795,
        'Rwanda': 12952218,
        'Benin': 12123200,
        'Burundi': 11890784,
        'Tunisia': 11818619,
        'Bolivia': 11673021,
        'Belgium': 11589623,
        'Haiti': 11402528,
        'Cuba': 11326616,
        'South Sudan': 11193725,
        'Dominican Republic': 10847910,
        'Czech Republic': 10708981,
        'Greece': 10423054,
        'Jordan': 10203134,
        'Portugal': 10196709,
        'Azerbaijan': 10139177,
        'Sweden': 10099265,
        'Honduras': 9904607,
        'United Arab Emirates': 9890402,
        'Hungary': 9660351,
        'Tajikistan': 9537645,
        'Belarus': 9449323,
        'Austria': 9006398,
        'Papua New Guinea': 8947024,
        'Serbia': 8737371,
        'Israel': 9216900,
        'Switzerland': 8654622,
        'Togo': 8278724,
        'Sierra Leone': 7976983,
        'Hong Kong': 7496981,
        'Laos': 7275560,
        'Paraguay': 7132538,
        'Bulgaria': 6948445,
        'Libya': 6871292,
        'Lebanon': 6825445,
        'Nicaragua': 6624554,
        'Kyrgyzstan': 6524195,
        'El Salvador': 6486205,
        'Turkmenistan': 6031200,
        'Singapore': 5850342,
        'Denmark': 5831404,
        'Finland': 5530719,
        'Congo': 5518087,
        'Slovakia': 5459642,
        'Norway': 5421241,
        'Oman': 5106626,
        'Palestine': 5101414,
        'Costa Rica': 5094118,
        'Liberia': 5057681,
        'Ireland': 4937786,
        'Central African Republic': 4829767,
        'New Zealand': 5122600,
        'Mauritania': 4649658,
        'Panama': 4314767,
        'Kuwait': 4270571,
        'Croatia': 4105267,
        'Moldova': 4033963,
        'Georgia': 3989167,
        'Eritrea': 3546421,
        'Uruguay': 3473730,
        'Bosnia and Herzegovina': 3280819,
        'Mongolia': 3278290,
        'Armenia': 2963243,
        'Jamaica': 2961167,
        'Qatar': 2881053,
        'Albania': 2877797,
        'Lithuania': 2722289,
        'Namibia': 2540905,
        'Gambia': 2416668,
        'Botswana': 2351627,
        'Gabon': 2225734,
        'Lesotho': 2142249,
        'North Macedonia': 2083374,
        'Slovenia': 2078938,
        'Latvia': 1901548,
        'Kosovo': 1895250,
        'Guinea-Bissau': 1968001,
        'Bahrain': 1701575,
        'Trinidad and Tobago': 1399488,
        'Estonia': 1326535,
        'Mauritius': 1271768,
        'Cyprus': 1207359,
        'Eswatini': 1160164,
        'Djibouti': 988000,
        'Fiji': 896444,
        'Comoros': 869601,
        'Guyana': 786552,
        'Bhutan': 771608,
        'Solomon Islands': 686884,
        'Macao': 649335,
        'Montenegro': 621718,
        'Luxembourg': 625978,
        'Suriname': 586634,
        'Cabo Verde': 555987,
        'Malta': 441543,
        'Brunei': 437479,
        'Belize': 397628,
        'Bahamas': 393244,
        'Maldives': 540544,
        'Iceland': 364134,
        'Vanuatu': 307145,
        'Barbados': 287375,
        'São Tomé and Príncipe': 219159,
        'Samoa': 198414,
        'Saint Lucia': 183627,
        'Kiribati': 119449,
        'Grenada': 112523,
        'Saint Vincent and the Grenadines': 110940,
        'Tonga': 105695,
        'Seychelles': 98347,
        'Antigua and Barbuda': 97929,
        'Andorra': 77265,
        'Dominica': 71986,
        'Marshall Islands': 59190,
        'Saint Kitts and Nevis': 53199,
        'Monaco': 39242,
        'Liechtenstein': 38128,
        'San Marino': 33931,
        'Palau': 18094,
        'Tuvalu': 11792,
        'Nauru': 10824,
        'Vatican City': 825
    };

    // Ensure population is a valid number
    let population = 0;
    try {
        // Try to get population from our data
        population = populationData[country.name.common] || 0;
        
        // Ensure it's a valid number
        if (isNaN(population)) {
            population = 0;
        }
    } catch (error) {
        console.warn(`Could not get population for ${country.name.common}:`, error);
    }

    // Count states/provinces/divisions
    let stateCount = 0;
    const stateData = {
        'United States': 50,
        'India': 28,
        'China': 23,
        'Brazil': 26,
        'Russia': 85,
        'Mexico': 31,
        'Germany': 16,
        'France': 18,
        'Canada': 13,
        'Australia': 6,
        'Argentina': 23,
        'Italy': 20,
        'Spain': 17,
        'United Kingdom': 4,
        'South Africa': 9,
        'Nigeria': 36,
        'Pakistan': 4,
        'Malaysia': 13,
        'Indonesia': 34,
        'Japan': 47,
        'South Korea': 9,
        'Thailand': 76,
        'Vietnam': 58,
        'Philippines': 81,
        'Turkey': 81,
        'Iran': 31,
        'Saudi Arabia': 13,
        'Egypt': 27,
        'Sudan': 18,
        'Ethiopia': 11,
        'Kenya': 47,
        'Tanzania': 31,
        'Uganda': 4,
        'Ghana': 16,
        'Morocco': 12,
        'Algeria': 58,
        'Iraq': 19,
        'Syria': 14,
        'Yemen': 22,
        'Oman': 11,
        'UAE': 7,
        'Qatar': 8,
        'Kuwait': 6,
        'Jordan': 12,
        'Lebanon': 8,
        'Israel': 6,
        'Afghanistan': 34,
        'Nepal': 7,
        'Bangladesh': 8,
        'Myanmar': 14,
        'Sri Lanka': 9,
        'Cambodia': 25,
        'Laos': 17,
        'Mongolia': 21,
        'Kazakhstan': 14,
        'Uzbekistan': 12,
        'Turkmenistan': 5,
        'Kyrgyzstan': 7,
        'Tajikistan': 4,
        'Azerbaijan': 66,
        'Georgia': 9,
        'Armenia': 11,
        'Belarus': 6,
        'Ukraine': 24,
        'Moldova': 32,
        'Romania': 41,
        'Bulgaria': 28,
        'Greece': 13,
        'Poland': 16,
        'Czech Republic': 14,
        'Slovakia': 8,
        'Hungary': 19,
        'Austria': 9,
        'Switzerland': 26,
        'Belgium': 3,
        'Netherlands': 12,
        'Denmark': 5,
        'Norway': 11,
        'Sweden': 21,
        'Finland': 19,
        'Estonia': 15,
        'Latvia': 119,
        'Lithuania': 60,
        'Portugal': 18,
        'Ireland': 26,
        'Iceland': 8,
        'New Zealand': 16,
        'Papua New Guinea': 22,
        'Solomon Islands': 9,
        'Fiji': 4,
        'Vanuatu': 6,
        'Madagascar': 6,
        'Mozambique': 11,
        'Zimbabwe': 10,
        'Zambia': 10,
        'Angola': 18,
        'DR Congo': 26,
        'Congo': 12,
        'Cameroon': 10,
        'Chad': 23,
        'Niger': 8,
        'Mali': 10,
        'Mauritania': 15,
        'Senegal': 14,
        'Guinea': 8,
        'Ivory Coast': 31,
        'Burkina Faso': 13,
        'Benin': 12,
        'Togo': 5,
        'Libya': 22,
        'Tunisia': 24
    };

    try {
        stateCount = stateData[country.name.common] || 0;
    } catch (error) {
        console.warn(`Could not get state count for ${country.name.common}:`, error);
    }

    const transformed = {
        name: country.name,
        tld: country.tld,
        cca2: country.cca2,
        ccn3: country.ccn3,
        cca3: country.cca3,
        independent: country.independent,
        status: country.status,
        currencies: country.currencies,
        capital: country.capital,
        region: country.region,
        subregion: country.subregion,
        languages: country.languages,
        translations: country.translations,
        latlng: country.latlng,
        landlocked: country.landlocked,
        borders: country.borders,
        area: country.area,
        flag: country.flag,
        population: population,
        stateCount: stateCount,
        flags: {
            png: `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`,
            svg: `https://flagcdn.com/w640/${country.cca2.toLowerCase()}.png`
        }
    };
    return transformed;
});

console.log('Country data transformed successfully');

// Endpoint to get all countries
app.get('/v3.1/all', (req, res) => {
    console.log('Sending all countries data');
    res.json(countries);
});

// Endpoint to get a country by name
app.get('/v3.1/name/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    console.log(`Searching for country with name: ${name}`);
    
    const matchingCountries = countries.filter(c => 
        c.name.common.toLowerCase().includes(name) ||
        c.name.official.toLowerCase().includes(name) ||
        Object.values(c.translations || {}).some(t => 
            t.common.toLowerCase().includes(name) || 
            t.official.toLowerCase().includes(name)
        )
    );
    
    console.log(`Found ${matchingCountries.length} matching countries`);
    
    if (matchingCountries.length > 0) {
        res.json(matchingCountries);
    } else {
        res.status(404).json({ status: 404, message: 'Country not found' });
    }
});

// Endpoint to get a country by code
app.get('/v3.1/alpha/:code', (req, res) => {
    const code = req.params.code.toLowerCase();
    console.log(`Searching for country with code: ${code}`);
    
    const matchingCountries = countries.filter(c => 
        c.cca2.toLowerCase() === code ||
        c.cca3.toLowerCase() === code ||
        c.ccn3 === code
    );
    
    console.log(`Found ${matchingCountries.length} matching countries`);
    
    if (matchingCountries.length > 0) {
        res.json(matchingCountries);
    } else {
        res.status(404).json({ status: 404, message: 'Country not found' });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 