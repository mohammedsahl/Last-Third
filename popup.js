document.getElementById("previous").addEventListener("click", changeDate)
document.getElementById("next").addEventListener("click", changeDate)
document.getElementById("today").addEventListener("click", changeDate)

let longitude, latitude = 0;
let offset = 0
const dayInSeconds = 86400
const secondsInMilliseconds = 1000

if (!navigator.geolocation) {
  alert('Geolocation is not supported by your browser');
} else {
  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    displayResults();
  }, error);
}

function getDate() {
  const today = new Date()
  const offsetDate = new Date(today)
  offsetDate.setDate(offsetDate.getDate() + offset)

  const dateOptions = { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' };
  const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
  const dateAsFormattedString = dateFormatter.format(offsetDate);
  document.getElementById("datetime").innerText = dateAsFormattedString;
  return offsetDate
}

function displayResults() {
  let thatDay = getDate();
  let timestampThatDay = Math.round(thatDay.getTime() / secondsInMilliseconds)
  let timestampDayBefore = Math.round((thatDay.getTime() / secondsInMilliseconds) - dayInSeconds)
  makeRequests(timestampThatDay, timestampDayBefore)
}

function getURL(timestamp, method, school) {
  const url = `http://api.aladhan.com/v1/timings/`
  const params = `${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`
  return `${url}${params}`
}

function makeRequests(timestampThatDay, timestampDayBefore) {
  chrome.storage.sync.get((items) => {
    Promise.all([
      fetch(getURL(timestampDayBefore, items.method, items.school)),
      fetch(getURL(timestampThatDay, items.method, items.school))
    ])
    .then((responses) => {
      return responses.map((response) => {
        return response.json();
      });
    }).then(async (data) => {
      const dayBefore = await data[0];
      const dayAfter = await data[1];
      const prayerTimingsList = document.querySelector("#prayer-timings").children

      const lastThirdElement = prayerTimingsList[0];
      const fajrElement = prayerTimingsList[1];
      const dhuhrElement = prayerTimingsList[2];
      const asrElement = prayerTimingsList[3];
      const maghribElement = prayerTimingsList[4];
      const ishaElement = prayerTimingsList[5];

      maghribTimeArray = (dayBefore.data.timings.Maghrib).split(':')
      fajrTimeArray = (dayAfter.data.timings.Fajr).split(':')

      let maghribDate = new Date(0,0,0, maghribTimeArray[0], maghribTimeArray[1])
      let fajrDate = new Date(0,0,1, fajrTimeArray[0], fajrTimeArray[1])
      let diff = new Date(fajrDate - ((fajrDate - maghribDate) / 3))

      lastThirdElement.innerHTML = `<a href="http://www.islamicfinder.org" target="_blank">Last third -  ${addZero(diff.getHours())}:${addZero(diff.getMinutes())}</a>`;
      fajrElement.innerHTML = `<a href="http://www.islamicfinder.org" target="_blank">Fajr - ${dayAfter.data.timings.Fajr}</a>`
      dhuhrElement.innerHTML = `<a href="http://www.islamicfinder.org" target="_blank">Zuhur - ${dayAfter.data.timings.Dhuhr}</a>`
      asrElement.innerHTML = `<a href="http://www.islamicfinder.org/" target="_blank">Asr - ${dayAfter.data.timings.Asr}</a>`
      maghribElement.innerHTML = `<a href="http://www.islamicfinder.org" target="_blank">Maghrib - ${dayAfter.data.timings.Maghrib}</a>`
      ishaElement.innerHTML = `<a href="http://www.islamicfinder.org" target="_blank">Isha - ${dayAfter.data.timings.Isha}</a>`
    }).catch((err) => {
      console.log(err);
    });
  })
}

function addZero(i) {
  if (i < 10) {i = "0" + i;}
  return i;
}

function error() {
  alert('Unable to retrieve your location')
}

function changeDate() {
  if (this.id === "previous") {
    offset -= 1
  } else if (this.id === "today") {
    offset = 0
  } else if (this.id === "next") {
    offset += 1
  }
  displayResults();
}
