// var dt = new Date();
// document.getElementById("datetime").innerHTML = dt.toLocaleDateString();

function success(position) {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  status.textContent = '';
  let httpRequest;

  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }


  httpRequest.onreadystatechange = updateContents;
  const timestamp = Math.round((new Date()).getTime() / 1000)
  // console.log(`http://api.aladhan.com/v1/timings/${Math.round((new Date()).getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2&school=1`);
  httpRequest.open('GET', `http://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2&school=1`);
  httpRequest.send();

  function updateContents() {
    const prayerTimingsList = document.querySelector("#prayer-timings").children

    const lastThirdElement = prayerTimingsList[0];
    const fajrElement = prayerTimingsList[1];
    const dhuhrElement = prayerTimingsList[2];
    const asrElement = prayerTimingsList[3];
    const maghribElement = prayerTimingsList[4];
    const ishaElement = prayerTimingsList[5];

    lastThirdElement.addEventListener("mouseover", hover)

    function addZero(i) {
      if (i < 10) {i = "0" + i;}
      return i;
    }

    function hover() {
      console.log(this.innerText);
    }

    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        today = new Date();
        res = JSON.parse(httpRequest.responseText)
        maghribTimeArray = (res.data.timings.Maghrib).split(':')
        fajrTimeArray = (res.data.timings.Fajr).split(':')
        let maghribDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() - 1, maghribTimeArray[0], maghribTimeArray[1])
        let fajrDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate(), fajrTimeArray[0], fajrTimeArray[1])
        let diff = new Date(fajrDate - ((fajrDate - maghribDate) / 3))
        // console.log(lastThirdElement);
        lastThirdElement.innerHTML = `<a href="http://www.islamicfinder.org">${lastThirdElement.innerText} ${addZero(diff.getHours())}:${addZero(diff.getMinutes())}</a>`;
        fajrElement.innerHTML = `<a href="http://www.islamicfinder.org">${fajrElement.textContent} ${res.data.timings.Fajr}</a>`
        dhuhrElement.innerHTML = `<a href="http://www.islamicfinder.org">${dhuhrElement.textContent} ${res.data.timings.Dhuhr}</a>`
        asrElement.innerHTML = `<a href="http://www.islamicfinder.org/">${asrElement.textContent} ${res.data.timings.Asr}</a>`
        maghribElement.innerHTML = `<a href="http://www.islamicfinder.org">${maghribElement.textContent} ${res.data.timings.Maghrib}</a>`
        ishaElement.innerHTML = `<a href="http://www.islamicfinder.org">${ishaElement.textContent} ${res.data.timings.Isha}</a>`
      } else {
        alert('There was a problem with the request.');
      }
    }
  }
}


function error() {
  status.textContent = 'Unable to retrieve your location';
}

if (!navigator.geolocation) {
  status.textContent = 'Geolocation is not supported by your browser';
} else {
  status.textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition(success, error);
}
