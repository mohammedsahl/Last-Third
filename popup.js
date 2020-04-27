
document.addEventListener('DOMContentLoaded', function () {
  // document.querySelector('button').addEventListener('click', onclick, false)
  // document.querySelector('#find-me').addEventListener('click', geoFindMe);

    const status = document.querySelector('#status');
    // const mapLink = document.querySelector('#map-link');

    // mapLink.href = '';
    // mapLink.textContent = '';

    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      status.textContent = '';
      // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

      let httpRequest;

      httpRequest = new XMLHttpRequest();

      if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
      }
      httpRequest.onreadystatechange = alertContents;
      console.log(`http://api.aladhan.com/v1/timings/${Date.now()}?latitude=${latitude}&longitude=${longitude}&method=2`);
        httpRequest.open('GET', `http://api.aladhan.com/v1/timings/${Math.round((new Date()).getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`);
        httpRequest.send();

        function alertContents() {
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
              maghrib = (res.data.timings.Maghrib).split(':')
              fajr = (res.data.timings.Fajr).split(':')
              let maghribDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() - 1, maghrib[0], maghrib[1])
              let fajrDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate(), fajr[0], fajr[1])
              let diff = new Date(fajrDate - ((fajrDate - maghribDate) / 3))
              status.textContent = `The lastThird of the night starts at ${addZero(diff.getHours())}:${addZero(diff.getMinutes())}`
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
