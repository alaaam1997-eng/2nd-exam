const globalCountry = document.querySelector("#global-country");
const globalCity = document.querySelector("#global-city");
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
  getCities();
});
 //=============================================

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
//=========================================================
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
async function getCities() {
  let country = globalCountry.options[globalCountry.selectedIndex].text.toLowerCase();
  await fetch(
    `https://api.restcountries.com/countries/v5?q=${country.toLowerCase()}`,
    {
      headers: {
        Authorization: "Bearer rc_live_90eb285764224847924b6f273c0ba908",
      },
    },
  )
  let postList2 = await response.json();
  console.log(postList2);
  displayCity();
}
let postList2 = [];
function displayCity() {
  let box = "";
  for (let i = 0; i < postList2.length; i++) {
    box += `<option name="${postList2[i].name}" value="${postList2[i].countryCode.toLowerCase()}">${postList[i].name}</option>`;
  }
  globalCity.innerHTML += box;
}
console.log(globalCity);

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

///////////////////////////////////////////////////////////
