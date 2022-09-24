const apikey = "&appid=43a2945a6d8d45fe8147d44181ef632b";
var urlCitysearch = "https://api.openweathermap.org/geo/1.0/direct?q="
var urlForecast = "https://api.openweathermap.org/data/2.5/forecast?"
var urlWeather = "https://api.openweathermap.org/data/2.5/weather?"
var result = -1
var lang
var localization = {
    "en":
        [
            // { id: "headtittle", text: "Weather" },
            { id: "city", text: "Search City..." }
        ],
    "es":
        [
            //{ id: "headtittle", text: "Tiempo" },
            { id: "city", text: "Buscar Ciudad..." }
        ]
}

function chkUnit_toggle(s) {
    lang = s.checked ? "en" : "es"

    for (var i = 0; i < localization[lang].length; i++) {
        var a = localization[lang][i];
        var dom = document.getElementById(a.id)
        if (dom.text) {
            dom.text = a.text
        }
        else if (dom.textContent) {
            dom.textContent = a.text
        }
        else if (dom.placeholder) {
            dom.placeholder = a.text
        }
    }
    let unit;
    if (s.checked) {//english
        unit = 'imperial'
    } else {
        unit = 'metric';

    }
    const className = document.getElementsByClassName('card')
    for (var i = 0; i < className.length; i++) {
        let city = className[i].getAttribute('city');
        let index = className[i].getAttribute('index');
        let coords = className[i].getAttribute('coords');
        getWeather(city, coords, index, unit);
    }
}

function getSeason(month, day) {
    if (month === '04' || month === '05') {
        return ('spring');
    } else if ((day >= 20 && month === '03') || (day < 21 && month === '06')) {
        return ('spring');
    } else if (month === '07' || month === '08') {
        return ("summer");
    } else if ((day >= 21 && month === '06') || (day < 22 && month === '09')) {
        return ("summer");
    } else if (month === '10' || month === '11') {
        return ("autumn");
    } else if ((day >= 22 && month === '09') || (day < 21 && month === '12')) {
        return ("autumn");
    } else if (month === 'Oct' || month === 'Nov') {
        return ("winter");
    } else if ((day >= 21 && month === '12') || (day < 20 && month === '03')) {
        return ("winter");
    }

}

function getWeather(city, coords, index, unit) {
    fetch("https://api.openweathermap.org/data/2.5/weather?"
        + coords
        + "&lang=" + lang
        + "&units=" + unit
        + apikey)
        .then((response) => response.json()).then((data) => displayWeather(coords, data, index, unit))
}

function displayWeather(coords, data, num, unit) {
    const { sunrise, sunset, country } = data.sys
    const { timezone } = data
    const { description, icon } = data.weather[0]
    const { temp, feels_like, temp_min, temp_max, humidity } = data.main
    const { speed, deg } = data.wind
    let sunriseTime = ''
    let sunsetTime = ''
    let timeSunrise = new Date((sunrise) * 1000);
    let timeSunset = new Date((sunset) * 1000);
    if (country == 'US') {
        sunriseTime = timeSunrise.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'America/New_York' });
        sunsetTime = timeSunset.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'America/New_York' });
    } else {
        sunriseTime = timeSunrise.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Europe/Madrid' })
        sunsetTime = timeSunset.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Europe/Madrid' })
    }

    sunriseTime = sunriseTime.substring(0, sunriseTime.indexOf(" ")) + ' AM';
    sunsetTime = sunsetTime.substring(0, sunsetTime.indexOf(" ")) + ' PM';


    let displayUnit = ''
    let displaySpeed = ''

    if (unit == 'metric') {
        displayUnit = '°C'
        displaySpeed = 'm/s'
    } else {
        displayUnit = '°F'
        displaySpeed = 'mph'
    }

    document.getElementById('temp' + num).innerText = Math.round(temp) + displayUnit;
    document.getElementById('feels' + num).innerText = Math.round(feels_like) + displayUnit;

    document.getElementById('icon' + num).src = "./icons/64/" + icon + ".svg";
    document.getElementById('desc' + num).innerText = description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementById('min' + num).innerText = Math.round(temp_min) + displayUnit;
    document.getElementById('max' + num).innerText = Math.round(temp_max) + displayUnit;

    document.getElementById('humedad' + num).innerText = humidity + '%';
    document.getElementById('viento' + num).innerText = speed + ' ' + displaySpeed + ' ' + this.getWindDirection(deg, lang);

    document.getElementById('sunrise' + num).textContent = sunriseTime;
    document.getElementById('sunset' + num).textContent = sunsetTime;

    getForecast(coords, data, unit, num, displayUnit);
}

function getForecast(coords, data, unit, num, displayUnit) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?"
        + coords
        + "&lang=" + lang
        + "&units=" + unit
        + apikey)
        .then((response) => response.json()).then((data) => displayForecast(data, num, lang, displayUnit))
}

function displayForecast(data, num, lang, displayUnit) {

    const { country, timezone } = data.city
    for (let j = 1; j < 6; j++) {
        populateFutureHours(data, num, j, displayUnit, country, timezone);
    }

    let daytemp = (new Date()).toLocaleDateString(locale, { weekday: 'short' });
    let index;
    for (let i = 0; i < 40; i++) {
        let day1 = (new Date((data.list[i].dt) * 1000)).toLocaleDateString(locale, { weekday: 'short' });
        if ((daytemp != day1)) {
            index = i + 2;
            break;
        }
    }
    populateFuture(data, num, 1, displayUnit, index, locale, lang, timezone);
    populateFuture(data, num, 2, displayUnit, index + 8, locale, lang, timezone);
    populateFuture(data, num, 3, displayUnit, index + 16, locale, lang, timezone);
    populateFuture(data, num, 4, displayUnit, index + 24, locale, lang, timezone);
    if ((index + 32) < 40) {
        populateFuture(data, num, 5, displayUnit, index + 32, locale, lang, timezone);
    } else {
        populateFuture(data, num, 5, displayUnit, 39, locale, lang, timezone);
    }

}

function populateFutureHours(data, card, j, displayUnit, country, timezone) {
    let hour;
    let dt_txt = data.list[j - 1].dt_txt;
    const date = data.list[j - 1].dt;


    if (country == 'US') {
        hour = (new Date(date * 1000)).toLocaleTimeString(locale, { hour: 'numeric', hour12: true, timeZone: 'America/New_York' })
        hora = (new Date(date * 1000)).toLocaleTimeString(locale, { hour: 'numeric', hour12: false, timeZone: 'America/New_York' })
    } else {
        hour = (new Date(date * 1000)).toLocaleTimeString(locale, { hour: 'numeric', hour12: true, timeZone: 'Europe/Madrid' })
        hora = (new Date(date * 1000)).toLocaleTimeString(locale, { hour: 'numeric', hour12: false, timeZone: 'America/New_York' })
    }
    if (hora > 12) {
        sistema = ' PM'
    } else {
        sistema = ' AM'
    }

    hour = hour.substring(0, hour.indexOf(" ")) + sistema;

    let icon = data.list[j - 1].weather[0].icon
    let temp = data.list[j - 1].main.temp
    hour = hour.replace(".", "");
    hour = hour.replace(".", "").toUpperCase();
    document.getElementById('hour' + card + j).innerText = hour;
    document.getElementById('iconHour' + card + j).src = "./icons/50/" + icon + ".svg"
    document.getElementById('tempHour' + card + j).innerText = Math.round(temp) + displayUnit
}

function populateFuture(data, card, day, displayUnit, index, locale, lang, timezone) {
    let dt_txt = data.list[index].dt_txt;
    const date = data.list[index].dt;
    let fecha = (new Date(date * 1000)).toLocaleString(lang, { weekday: 'short' })
    let icon = data.list[index].weather[0].icon
    let temp = data.list[index].main.temp
    document.getElementById('day' + card + day).innerText = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    document.getElementById('iconday' + card + day).src = "./icons/50/" + icon + ".svg"
    document.getElementById('tempday' + card + day).innerText = Math.round(temp) + displayUnit
}

function getWindDirection(deg, lang) {
    switch (true) {
        case ((deg >= 348.75) || (deg < 11.25)):
            return 'N'
            break;
        case ((deg >= 11.25) && (deg < 33.75)):
            return 'NNE'
            break;
        case ((deg >= 33.75) && (deg < 56.25)):
            return 'NE'
            break;
        case ((deg >= 56.25) && (deg < 78.75)):
            return 'ENE'
            break;
        case ((deg >= 78.75) && (deg < 101.25)):
            return 'E'
            break;
        case ((deg >= 101.25) && (deg < 123.75)):
            return 'ESE'
            break;
        case ((deg >= 123.75) && (deg < 146.25)):
            return 'SE'
            break;
        case ((deg >= 146.25) && (deg < 168.75)):
            return 'SSE'
            break;
        case ((deg >= 168.75) && (deg < 191.25)):
            return 'S'
            break;
        case ((deg >= 191.5) && (deg < 213.75)):
            if (lang == 'en') {
                return 'SSW'
            } else {
                return 'SSO'
            }
            break;
        case ((deg >= 213.75) && (deg < 236.25)):
            if (lang == 'en') {
                return 'SW'
            } else {
                return 'SO'
            }
            break;
        case ((deg >= 236.25) && (deg < 258.75)):
            if (lang == 'en') {
                return 'WSW'
            } else {
                return 'OSO'
            }
            break;
        case ((deg >= 258.75) && (deg < 281.25)):
            if (lang == 'en') {
                return 'W'
            } else {
                return 'O'
            }
            break;
        case ((deg >= 281.25) && (deg < 303.75)):
            if (lang == 'en') {
                return 'WNW'
            } else {
                return 'OSO'
            }
            break;
        case ((deg >= 303.75) && (deg < 326.25)):
            if (lang == 'en') {
                return 'NW'
            } else {
                return 'NO'
            }
            break;
        case ((deg >= 326.25) && (deg < 348.75)):
            if (lang == 'en') {
                return 'NNW'
            } else {
                return 'NNO'
            }
    }

}

function random(number) {
    return Math.floor(Math.random() * number) + 1;
}

function mayusc(str) {
    const words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ")//str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function setLocalStorage(city) {
    let position = city.search("#")
    let search = city.slice(position + 1);
    let index = city.substring(0, position)
    switch (search) {
        case "juaida":
            localStorage.setItem(city, "lat=36.86&lon=-2.46&");
            addElement(search.toLowerCase(), locale, index);
            chkUnit_toggle(document.getElementById("check1"));
            break;
        case "santirso":
            localStorage.setItem(city, "lat=42.24&lon=-7.56&");
            addElement(search.toLowerCase(), locale, index);
            chkUnit_toggle(document.getElementById("check1"));
            break;
        case "middletown":
            localStorage.setItem(city, "lat=40.06&lon=-85.54&");
            addElement(search.toLowerCase(), locale, index);
            chkUnit_toggle(document.getElementById("check1"));
            break;
        case "anderson":
            localStorage.setItem(city, "lat=40.10&lon=-85.68&");
            addElement(search.toLowerCase(), locale, index);
            chkUnit_toggle(document.getElementById("check1"));
            break;
        case "greenwood":
            localStorage.setItem(city, "lat=39.59&lon=-86.08&");
            addElement(search.toLowerCase(), locale, index);
            chkUnit_toggle(document.getElementById("check1"));
            break;
        default:
            //   console.log(urlCitysearch + search + apikey);
            fetch(urlCitysearch + search + apikey).then((response) => response.json()).then((data) => {
                try {
                    localStorage.setItem(city, "lat=" + data[0].lat + "&lon=" + data[0].lon + "&")
                    addElement(search.toLowerCase(), locale, index);
                    chkUnit_toggle(document.getElementById("check1"));

                } catch (e) {
                    result = 0;

                }
            });
    }
}

function addElementSearchBar() {
    var search = document.querySelector(".form__input").value


    search = (localStorage.length + 1) + '#' + search.trim();
    //console.log(search);
    if (search != '') {
        if (!localStorage.getItem(search)) {
            setLocalStorage(search.toLowerCase());
        }
    }
    document.querySelector(".form__input").value = '';
    window.scrollTo(0, document.querySelector(".card-wrapper").scrollHeight);
}

function addElement(city, locale, index_card) {
    if (city != '') {
        var coords = localStorage.getItem(index_card + '#' + city);
        //     console.log(index_card + '#' + city);
        var target = document.querySelector(".card-wrapper");
        var sHTML = '<div class="card" index="' + index_card + '" coords="' + coords + '" city="' + city + '" id="card' + index_card + '"> ' +
            '<div class="cover">' +
            ' <div class="delete_div">' +
            '<button class="delete_button" onclick="removeCard(this)">' +
            '<svg ' +
            'stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="1 -1 24 24 " height="2.8em" width="2.8em" xmlns="http://www.w3.org/2000/svg">' +
            '<path ' +
            'd="M12 3c-4.963 0-9 4.038-9 9s4.037 9 9 9 9-4.038 9-9-4.037-9-9-9zm0 16c-3.859 0-7-3.14-7-7s3.141-7 7-7 7 3.14 7 7-3.141 7-7 7zM12.707 12l2.646-2.646c.194-.194.194-.512 0-.707-.195-.194-.513-.194-.707 0l-2.646 2.646-2.646-2.647c-.195-.194-.513-.194-.707 0-.195.195-.195.513 0 .707l2.646 2.647-2.646 2.646c-.195.195-.195.513 0 .707.097.098.225.147.353.147s.256-.049.354-.146l2.646-2.647 2.646 2.646c.098.098.226.147.354.147s.256-.049.354-.146c.194-.194.194-.512 0-.707l-2.647-2.647z"' +
            '></path>' +
            '</svg>' +
            '</button>' +
            '</div>' +
            '<div class="container"><h1 id="city' + index_card + '">' + mayusc(city) + '</h1></div> <div class="container"> <div class="temp"> <div><h1 id="temp' + index_card + '">65°F</h1></div> ' +
            ' <div><h7 id="desc' + index_card + '">Clear sky</h7></div> <div><h4 id="feels' + index_card + '">65°F</h4></div> ' +
            ' <div> <img class="icon" src="./icons/min24.svg" alt="" /> <h7 id="min' + index_card + '">71°F</h7> <img class="icon" src="./icons/max24.svg" alt="" /><h7 id="max' + index_card + '">76°F</h7> </div>' +
            '</div>' +
            '<div class="conditions"><img  class="icon" id="icon' + index_card + '" src="./icons/64/50n.svg" alt="" /></div>' +
            '</div> ' +
            '<div class="container">' +
            '<div class="extradata">' +
            '<div><img class="icon" src="./icons/humidity24.svg" alt="" /> <h7 id = "humedad' + index_card + '" class="icon-text">76%</h7></div>' +
            '<div><img class="icon" src="./icons/wind24.svg" alt="" /><h7 id ="viento' + index_card + '" class="icon-text">6.91 mph SSW</h7></div>' +
            '</div>' +
            '<div class="extradata">' +
            '<div><img class="icon" src="./icons/sunrise24.svg" alt="" /><h7 id="sunrise' + index_card + '" class="icon-text">7:28 AM</h7> </div>' +
            '<div><img class="icon" src="./icons/sunset24.svg" alt="" /><h7 id="sunset' + index_card + '" class="icon-text">7:48 PM</h7></div>' +
            '</div>' +
            '</div>' +
            '<div class="container">';

        sHTML += '<div class="future">  ';
        for (let j = 1; j <= 4; j++) {
            sHTML += '<div class="hours">' +
                '           <h7 id="hour' + index_card + j + '">2AM</h7>' +
                '           <div><img id="iconHour' + index_card + j + '" src="./icons/50/01d.svg" alt="" class="icon" /></div>' +
                '           <h7 id="tempHour' + index_card + j + '">35°C</h7>' +
                '          </div>'
        }
        sHTML += '<div class="lhour">' +
            '<ht h7 id = "hour' + index_card + '5" > 11 PM</ht >' +
            '<img id="iconHour' + index_card + '5" src="./icons/50/11n.svg" alt="" class="icon" />' +
            '<h7 id="tempHour' + index_card + '5">69°F</h7>' +
            '</div >' +
            '</div >' +
            '</div >' +
            '<div class="container">' +
            '<div class="future">';
        for (let j = 1; j <= 4; j++) {
            sHTML += '<div class="days">' +
                '           <h7 id="day' + index_card + j + '">MON</h7>' +
                '           <div><img id="iconday' + index_card + j + '" src="./icons/50/01d.svg" alt="" class="icon" /></div>' +
                '           <h7 id="tempday' + index_card + j + '">35°C</h7>' +
                '          </div>'
        }


        sHTML += '<div class="lday">' +
            '<h7 id="day' + index_card + '5">Fri</h7>' +
            '<img id="iconday' + index_card + '5" src="./icons/50/01d.svg" alt="" class="icon" />' +
            '<h7 id="tempday' + index_card + '5">40°F</h7>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div >' +
            '</div >';

        target.innerHTML += sHTML;

        setBackgroundImage(index_card, city);
        //  index_card += 1;

    }
}

function setBackgroundImage(i, city) {
    var folder
    let seasson = ''
    let month = (new Date()).toLocaleDateString(locale, { month: "2-digit" });
    let day = (new Date()).toLocaleDateString(locale, { day: "2-digit" });

    let season = getSeason(month, day);
    if (["almeria", "anderson", "chirivel", "greenwood", "juaida", "malaga", "middletown", "santirso"].includes(city)) {
        folder = city;
    }
    else {
        folder = "generic/" + season
    }
    var card = document.getElementById("card" + i);
    card.style.backgroundImage = 'url(./images/' + folder + '/' + random(5) + '.jpg)';
    card.style.backgroundPosition = 'center';
    card.style.backgroundRepeat = 'no-repeat';
    card.style.backgroundSize = 'cover';


}
function removeCard(elem) {
    div = elem.closest('.card');
    let card = (div.id).replace('card', '');
    h = document.getElementById('city' + card);

    localStorage.removeItem(card + '#' + h.innerText.toLowerCase())
    if (div) {
        div.remove();
    }

}

document.querySelector(".search button").addEventListener("click", function () {
    addElementSearchBar()
})

document.querySelector(".form__input").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addElementSearchBar();
    }
})

const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

const locale = userLocale[0] + userLocale[1]

let seasson = ''
month = (new Date()).toLocaleDateString(locale, { month: "2-digit" });
day = (new Date()).toLocaleDateString(locale, { day: "2-digit" });

let season = getSeason(month, day);

var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = './icons/' + season + '.png'


let cities = new Array();

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    cities.push(key)

};
//console.log(cities.sort());

/*for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    addElement(key, locale);
};*/
cities.forEach((element, index) => {
    let position = element.search("#")
    let search = element.slice(position + 1);
    //    console.log(element.substring(0, position));
    addElement(search, locale, element.substring(0, position));
});

let language = ''

if ((locale) == 'en') {
    document.getElementById("check1").checked = true;
    language = 'en'
    chkUnit_toggle(document.getElementById("check1"))
    // getCards('./data/cities.json');

}
else {
    language = 'es'
    document.getElementById("check1").checked = false;
    // getCards('./data/ciudades.json');
    chkUnit_toggle(document.getElementById("check1"))
}

