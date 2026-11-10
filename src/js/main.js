const globalCountry = document.querySelector("#global-country");
const globalCity = document.querySelector("#global-city");
const eventsContent = document.querySelector("#events-content");
const sunTimesContent = document.querySelector("#sun-times-content");
const countryInformaion = document.querySelector("#dashboard-country-info");
const currencyFrom = document.querySelector("#currency-from");
const currencyTo = document.querySelector("#currency-to");
const globalYear = document.querySelector("#global-year.form-select");
const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const sideBar = document.querySelector("#sidebar");
const selectedDestination = document.querySelector("#selected-destination");
const sideBarLinks = document.querySelectorAll(".sidebar-nav .nav-item");
const mainView = document.querySelectorAll("#main-content .view");
const holidaysContent = document.querySelector("#holidays-content");
const lwContent = document.querySelector("#lw-content");
const viewHeaderSelection = document.querySelectorAll(".view-header-selection");
//=============open & close sideBar===============
mobileMenuBtn.addEventListener("click", function () {
  sideBar.classList.add("open");
});
document.addEventListener("click", (e) => {
  if (!sideBar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    sideBar.classList.remove("open");
  }
});
//==============countryList===================
async function getCountry() {
  const response = await fetch(
    `https://date.nager.at/api/v3/AvailableCountries`,
  );
  postList = await response.json();
  displayContry();
}
let postList = [];
function displayContry() {
  let box = "";
  for (let i = 0; i < postList.length; i++) {
    box += `<option name="${postList[i].name}" value="${postList[i].countryCode.toLowerCase()}">${postList[i].name}</option>`;
  }
  globalCountry.innerHTML += box;
}

globalYear.addEventListener("change", function () {
  getCountryHoliDay();
  getEventCard();
});
getCountry();
//=====================viewCountry===================
globalCountry.addEventListener("change", function () {
  const selectedName = this.options[this.selectedIndex].text;
  selectedDestination.classList.remove("hidden");
  selectedDestination.innerHTML = `<div class="selected-flag">
  <img id="selected-country-flag" src="https://flagcdn.com/w80/${this.value.toLowerCase()}.png" alt="${this.value.toLowerCase()}">
    </div>
    <div class="selected-info">
    <span class="selected-country-name" id="selected-country-name">${selectedName}</span>
    </div>
    <button class="clear-selection-btn" onclick="removeCountry()" id="clear-selection-btn">
    <i class="fa-solid fa-xmark"></i>
    </button>`;
  getCountryHoliDay();
  getLongWeekend();
  getCountries();
  getEventCard();
  getCities();
});
//=============================================
globalCity.addEventListener("change", function () {
  getEventCard();
  getCityCoordinates();
});
//=====================removeCountry===================
function removeCountry() {
  selectedDestination.classList.add("hidden");
}
//====================activeSideBar===================

sideBarLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    sideBarLinks.forEach(function (item) {
      item.classList.remove("active");
    });
    this.classList.add("active");
  });
});

sideBarLinks.forEach(function (button) {
  button.addEventListener("click", function () {
    mainView.forEach(function (section) {
      section.classList.remove("active");
    });
    const target = document.getElementById(this.dataset.view);
    target.classList.add("active");
  });
});
//==================holidaysSection==================
async function getCountryHoliDay() {
  const countryCode = globalCountry.value;
  let year = globalYear.value;
  const response2 = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  );
  countryHoliDay = await response2.json();
  //   displayContry();
  displayContryHoliDay();
}
let countryHoliDay = [];
function displayContryHoliDay() {
  let cartoona = "";
  for (let i = 0; i < countryHoliDay.length; i++) {
    let date = countryHoliDay[i].date;
    let dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
    let day = date.split("-")[2];
    let month = new Date(date).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    cartoona += `<div class="holiday-card">
      <div class="holiday-card-header">
                <div class="holiday-date-box"><span class="day">${day}</span><span class="month">${month}</span></div>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>${countryHoliDay[i].localName}</h3>
              <p class="holiday-name">${countryHoliDay[i].name}</p>
              <div class="holiday-card-footer">
              <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${dayName}</span>
              <span class="holiday-type-badge">${countryHoliDay[i].types}</span>
              </div>
              </div>`;
  }

  holidaysContent.innerHTML = cartoona;
}
//========================headerSections========================
function addTagInHoliDay() {
  let year = globalYear.value;
  const selectedName = globalCountry.options[globalCountry.selectedIndex].text;
  for (let i = 0; i < viewHeaderSelection.length; i++) {
    viewHeaderSelection[i].innerHTML = `<div class="current-selection-badge">
                <img src="https://flagcdn.com/w40/${globalCountry.value.toLowerCase()}.png" alt="${globalCountry.value.toLowerCase()}" class="selection-flag">
                <span>${selectedName}</span>
                <span class="selection-year">${year}</span>
              </div>`;
  }
  getCountryHoliDay();
}
//======================gitLongWeekEnd===================================
async function getLongWeekend() {
  const countryCode = globalCountry.value;
  let year = globalYear.value;
  const response2 = await fetch(
    `https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode.toUpperCase()}`,
  );
  countryLongWeekend = await response2.json();
  displayLongWeekend();
}
getLongWeekend();
let countryLongWeekend = [];
function displayLongWeekend() {
  let year = globalYear.value;

  let cartoona2 = "";
  for (let i = 0; i < countryLongWeekend.length; i++) {
    let startDate = countryLongWeekend[i].startDate;
    let endDate = countryLongWeekend[i].endDate;
    let startDay = startDate.split("-")[2];
    let endDay = endDate.split("-")[2];
    let month = new Date(startDate).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    let needDays = countryLongWeekend[i].needBridgeDay
      ? "No extra days off needed!"
      : "Requires taking a bridge day off";
    cartoona2 += `<div class="lw-card">
              <div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${countryLongWeekend[i].dayCount} Days</span>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>Long Weekend #${i + 1}</h3>
              <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${month} ${startDay} - ${month} ${endDay}, ${year}</div>
              <div class="lw-info-box success"><i class="fa-solid fa-check-circle"></i> ${needDays}</div>
              <div class="lw-days-visual">
                <div class="lw-day"><span class="name">Thu</span><span class="num">1</span></div>
                <div class="lw-day weekend"><span class="name">Fri</span><span class="num">2</span></div>
                <div class="lw-day weekend"><span class="name">Sat</span><span class="num">3</span></div>
                <div class="lw-day weekend"><span class="name">Sun</span><span class="num">4</span></div>
              </div>
            </div>`;
  }

  lwContent.innerHTML = cartoona2;
}
// ==========================================================
async function getCountries() {
  let country =
    globalCountry.options[globalCountry.selectedIndex].text.toLowerCase();

  let response = await fetch(
    `https://api.restcountries.com/countries/v5?q=${country}`,
    {
      headers: {
        Authorization: "Bearer rc_live_90eb285764224847924b6f273c0ba908",
      },
    },
  );

  let result = await response.json();
  let countryData = result.data.objects[0];
  displayCountry(countryData);
}
let countryClock;
function displayCountry(countryData) {
  let box = `
  <div class="dashboard-country-header">
  <img
  src="${countryData.flag?.url_png || ""}"
  alt="${countryData.names?.common || "N/A"}"
  class="dashboard-country-flag"
/>

<div class="dashboard-country-title">
  <h3>${countryData.names?.common || "N/A"}</h3>

  <p class="official-name">
    ${countryData.names?.official || "N/A"}
  </p>

  <span class="region">
    <i class="fa-solid fa-location-dot"></i>
    ${countryData.region || "N/A"} • ${countryData.subregion || "N/A"}
  </span>
</div>
</div>

<div class="dashboard-local-time">
  <div class="local-time-display">
    <i class="fa-solid fa-clock"></i>
    <span class="local-time-value" id="country-local-time">--:--:--</span>
    <span class="local-time-zone">${countryData.timezones?.[0]}</span>
  </div>
</div>

<div class="dashboard-country-grid">
  <div class="dashboard-country-detail">
    <i class="fa-solid fa-building-columns"></i>
    <span class="label">Capital</span>
    <span class="value">${countryData.capitals?.[0]?.name || "N/A"}</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-users"></i>
    <span class="label">Population</span>
    <span class="value">${countryData.population?.toLocaleString() || "N/A"}</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-ruler-combined"></i>
    <span class="label">Area</span>
    <span class="value">${countryData.area?.kilometers?.toLocaleString() || "N/A"} km²</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-globe"></i>
    <span class="label">Continent</span>
    <span class="value">${countryData.continents?.join(", ") || "N/A"}</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-phone"></i>
    <span class="label">Calling Code</span>
    <span class="value">${countryData.calling_codes?.length ? "+" + countryData.calling_codes.join(", +") : "N/A"}</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-car"></i>
    <span class="label">Driving Side</span>
    <span class="value">${countryData.cars?.driving_side || "N/A"}</span>
  </div>

  <div class="dashboard-country-detail">
    <i class="fa-solid fa-calendar-week"></i>
    <span class="label">Week Starts</span>
    <span class="value">${countryData.date?.start_of_week || "N/A"}</span>
  </div>
</div>
<div class="dashboard-country-extras">

  <div class="dashboard-country-extra">
    <h4><i class="fa-solid fa-coins"></i> Currency</h4>
    <div class="extra-tags">
      ${
        countryData.currencies
          ? Object.values(countryData.currencies)
              .map(function (currency) {
                return `
                <span class="extra-tag">
                  ${currency.name} (${currency.code} ${currency.symbol || ""})
                </span>
              `;
              })
              .join("")
          : "N/A"
      }
    </div>
  </div>

  <div class="dashboard-country-extra">
    <h4><i class="fa-solid fa-language"></i> Languages</h4>
    <div class="extra-tags">
       ${
         countryData.languages
           ? Object.values(countryData.languages[0])
               .map(function (language) {
                 return `
                <span class="extra-tag">${language}</span>
              `;
               })
               .join("")
           : "N/A"
       }
    </div>
  </div>

  <div class="dashboard-country-extra">
    <h4>
      <i class="fa-solid fa-map-location-dot"></i> Neighbors
    </h4>
    <div class="extra-tags">
      ${
        countryData.borders?.length
          ? countryData.borders
              .map(function (neighbor) {
                return `
                <span class="extra-tag border-tag">${neighbor}</span>
              `;
              })
              .join("")
          : "No Neighbors"
      }
    </div>
  </div>

</div>
<div class="dashboard-country-actions">
  <a
    href="https://www.google.com/maps/place/${countryData.names?.common || ""}"
    target="_blank"
    class="btn-map-link"
  >
    <i class="fa-solid fa-map"></i> View on Google Maps
  </a>
</div>`;
  countryInformaion.innerHTML = box;
  clearInterval(countryClock);

  let timeZone = countryData.timezones?.[0];

  if (timeZone) {
    function updateCountryTime() {
      let now = new Date();

      let offset = timeZone.replace("UTC", "");

      let hours = Number(offset.slice(0, 3));
      let minutes = Number(offset.slice(4, 6));

      let countryTime = new Date(
        now.getTime() + (hours * 60 + Math.sign(hours) * minutes) * 60000,
      );

      document.getElementById("country-local-time").innerHTML = countryTime
        .toUTCString()
        .slice(17, 25);
    }

    updateCountryTime();

    countryClock = setInterval(updateCountryTime, 1000);
  }
}
//==============displayCities===============================
async function getCities() {
  let country = globalCountry.options[globalCountry.selectedIndex].text;

  let response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/cities",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: country,
      }),
    },
  );

  let data = await response.json();

  postList2 = data.data;

  displayCity();
}
let postList2 = [];
function displayCity() {
  let box = "";

  for (let i = 0; i < postList2.length; i++) {
    box += `<option value="${postList2[i]}">${postList2[i]}</option>`;
  }

  globalCity.innerHTML = box;
}
//=====================================================
let exchangeRates = {};
async function getCurrencies() {
  let response = await fetch(
    `https://v6.exchangerate-api.com/v6/805842951e5953ad31497176/latest/USD`,
  );

  let data = await response.json();

  exchangeRates = data.conversion_rates;

  displayCurrencies();
}

// async function getCurrencies() {
//   let from = currencyFrom.value;
//   let to = currencyTo.value;
//   let response = await fetch(
//     `https://v6.exchangerate-api.com/v6/805842951e5953ad31497176/pair/${from}/${to}/100`,
//   );

//   let data = await response.json();

//   exchangeRates = data.conversion_rates;
// }

getCurrencies();

function displayCurrencies() {
  let box = "";

  for (let currency in exchangeRates) {
    box += `
      <option value="${currency}">${currency}</option>
    `;
  }

  currencyFrom.innerHTML = box;
  currencyTo.innerHTML = box;

  //   currencyTo.value = "EGP";
}
//===================eventCard======================
async function getEventCard() {
  let city1 = globalCity.value;
  let country1 = globalCountry.value;
  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${city1}&${country1.toUpperCase()}=US&size=20`,
  );
  let data = await response.json();
  eventCard = data._embedded?.events || [];
  displayEventCard();
}
let eventCard = [];
function displayEventCard() {
  let box = "";
  for (let i = 0; i < eventCard.length; i++) {
    box += `<div class="event-card">
                <div class="event-card-image">
                  <img
                    src="${eventCard[i].images[0].url || ""}"
                  />
                  <span class="event-card-category">${eventCard[i].classifications?.[0]?.segment?.name || "Other"}</span>
                  <button class="event-card-save">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <div class="event-card-body">
                  <h3>${eventCard[i].name}</h3>
                  <div class="event-card-info">
                    <div>
                      <i class="fa-regular fa-calendar"></i>${eventCard[i].dates?.start?.dateTime || "Date unavailable"}
                    </div>
                    <div>
                      <i class="fa-solid fa-location-dot"></i>${eventCard[i]._embedded?.venues?.[0]?.name || "Location unavailable"}</div>
                  </div>
                  <div class="event-card-footer">
                    <button class="btn-event">
                      <i class="fa-regular fa-heart"></i> Save
                    </button>
                    <a href="${eventCard[i].url}" class="btn-buy-ticket"
                      ><i class="fa-solid fa-ticket"></i> Buy Tickets</a
                    >
                  </div>
                </div>
              </div>`;
  }
  eventsContent.innerHTML = box;
}
//=====================weather==================
async function getCityCoordinates() {
  let city = globalCity.value;
  let country = globalCountry.value;

  let response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&countryCode=${country}&language=en&format=json`,
  );
  let data = await response.json();
  let lat = data.results[0].latitude;
  let lon = data.results[0].longitude;
  let response2 = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&formatted=0`,
  );
  sunriseData = await response2.json();
  displayCitySunRise();
}
let sunriseData = [];
function displayCitySunRise() {
  let box = "";
  let city = globalCity.value;
  let year = globalYear.value;
  let date = new Date(sunriseData.results.sunrise);
  let formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  let dayName = date.toLocaleDateString("en-US", {
    weekday: "long",
  });
  let sunSet = sunriseData.results.sunset.split("T")[1].slice(0, 5);
  let sunRise = sunriseData.results.sunrise.split("T")[1].slice(0, 5);
  let solarNoon = sunriseData.results.solar_noon.split("T")[1].slice(0, 5);
  let dawn = sunriseData.results.civil_twilight_begin.split("T")[1].slice(0, 5);
  let dusk = sunriseData.results.civil_twilight_end.split("T")[1].slice(0, 5);
  let dayLength = sunriseData.results.day_length;
  let dayPercentage = (dayLength / 86400) * 100;
  let nightLength = 86400 - dayLength;
  let hours = Math.floor(dayLength / 3600);
  let minutes = Math.floor((dayLength % 3600) / 60);
  let hoursNight = Math.floor(nightLength / 3600);
  let minutesNight = Math.floor((nightLength % 3600) / 60);

  box += `              <div class="sun-main-card">
                <div class="sun-main-header">
                  <div class="sun-location">
                    <h2><i class="fa-solid fa-location-dot"></i> ${city}</h2>
                    <p>Sun times for your selected location</p>
                  </div>
                  <div class="sun-date-display">
                    <div class="date">${formattedDate}</div>
                    <div class="day">${dayName}</div>
                  </div>
                </div>

                <div class="sun-times-grid">
                  <div class="sun-time-card dawn">
                    <div class="icon"><i class="fa-solid fa-moon"></i></div>
                    <div class="label">Dawn</div>
                    <div class="time">${dawn} AM</div>
                    <div class="sub-label">Civil Twilight</div>
                  </div>
                  <div class="sun-time-card sunrise">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Sunrise</div>
                    <div class="time">${sunRise} AM</div>
                    <div class="sub-label">Golden Hour Start</div>
                  </div>
                  <div class="sun-time-card noon">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Solar Noon</div>
                    <div class="time">${solarNoon} PM</div>
                    <div class="sub-label">Sun at Highest</div>
                  </div>
                  <div class="sun-time-card sunset">
                    <div class="icon"><i class="fa-solid fa-sun"></i></div>
                    <div class="label">Sunset</div>
                    <div class="time">${sunSet} PM</div>
                    <div class="sub-label">Golden Hour End</div>
                  </div>
                  <div class="sun-time-card dusk">
                    <div class="icon"><i class="fa-solid fa-moon"></i></div>
                    <div class="label">Dusk</div>
                    <div class="time">${dusk} PM</div>
                    <div class="sub-label">Civil Twilight</div>
                  </div>
                  <div class="sun-time-card daylight">
                    <div class="icon">
                      <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div class="label">Day Length</div>
                    <div class="time">${hours}h ${minutes}m</div>
                    <div class="sub-label">Total Daylight</div>
                  </div>
                </div>
              </div>

              <div class="day-length-card">
                <h3>
                  <i class="fa-solid fa-chart-pie"></i> Daylight Distribution
                </h3>
                <div class="day-progress">
                  <div class="day-progress-bar">
                    <div class="day-progress-fill" style="width: ${dayPercentage.toFixed(1)}%"></div>
                  </div>
                </div>
                <div class="day-length-stats">
                  <div class="day-stat">
                    <div class="value">${hours}h ${minutes}m</div>
                    <div class="label">Daylight</div>
                  </div>
                  <div class="day-stat">
                    <div class="value">${dayPercentage.toFixed(1)}%</div>
                    <div class="label">of 24 Hours</div>
                  </div>
                  <div class="day-stat">
                    <div class="value">${hoursNight}h ${minutesNight}m</div>
                    <div class="label">Darkness</div>
                  </div>
                </div>
              </div>`;
  sunTimesContent.innerHTML = box;
}

// ///////////////////////////////////////////////////////////
