
document.addEventListener('DOMContentLoaded', function () {
    const status = document.querySelector('#status');

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
      // console.log(`http://api.aladhan.com/v1/timings/${Date.now()}?latitude=${latitude}&longitude=${longitude}&method=2`);
        httpRequest.open('GET', `http://api.aladhan.com/v1/timings/${Math.round((new Date()).getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`);
        httpRequest.send();

        function updateContents() {
          const prayerTimingsList = document.querySelector('#prayer-timings')
          const lastThirdElement = prayerTimingsList.children[0];
          const fajrElement = prayerTimingsList.children[1];
          const dhuhrElement = prayerTimingsList.children[2];
          const asrElement = prayerTimingsList.children[3];
          const maghribElement = prayerTimingsList.children[4];
          const ishaElement = prayerTimingsList.children[5];

          // console.log(lastThirdElement);

          function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
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
              lastThirdElement.innerHTML = `<a href="https://www.islamicfinder.org/">${lastThirdElement.innerText} ${addZero(diff.getHours())}:${addZero(diff.getMinutes())}</a>`;
              fajrElement.innerHTML = `<a href="https://www.islamicfinder.org/">${fajrElement.textContent} ${res.data.timings.Fajr}</a>`
              dhuhrElement.innerHTML = `<a href="https://www.islamicfinder.org/">${dhuhrElement.textContent} ${res.data.timings.Dhuhr}</a>`
              asrElement.innerHTML = `<a href="https://www.islamicfinder.org/">${asrElement.textContent} ${res.data.timings.Asr}</a>`
              maghribElement.innerHTML = `<a href="https://www.islamicfinder.org/">${maghribElement.textContent} ${res.data.timings.Maghrib}</a>`
              ishaElement.innerHTML = `<a href="https://www.islamicfinder.org/">${ishaElement.textContent} ${res.data.timings.Isha}</a>`

              // status.textContent = `The lastThird of the night starts at ${addZero(diff.getHours())}:${addZero(diff.getMinutes())}`
              // alert(`Fajr is at ${fajr} and Maghrib is at ${maghrib}`)
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

  })
