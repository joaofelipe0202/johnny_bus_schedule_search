const streets = document.querySelector('.streets');
const info = document.querySelector('tbody'); 
const streetTitleName = document.querySelector('#street-name');

const getStreets = streetName => {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=cmZaYN5yrwwmepOUIVTd&name=${streetName}`)
  .then(response => response.json())
}

const getBusStopInfo = streetKey => {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=cmZaYN5yrwwmepOUIVTd&street=${streetKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject({response: response.status, response: response.statusText});
      }
    })
    .then(busStop => {
      const allBusStopSchedule = [];

      busStop.stops.forEach(stop => {
        allBusStopSchedule.push(
          fetch(`https://api.winnipegtransit.com/v3/stops/${stop.key}/schedule.json?api-key=cmZaYN5yrwwmepOUIVTd`)
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                Promise.reject({response: response.status, response: response.statusText});
              }
            })
            .then(schedule => {
              return schedule['stop-schedule'];
            })
        );
      })

      Promise.all(allBusStopSchedule)
        .then(stopScheduleList => {
        showSchedules(stopScheduleList);
        updateBusStopTitle(busStop);
      });
    })
}

const returnStreetName = streetNameList => {
  
  if (streetNameList.length === 0) {
    streets.innerHTML = 'No Streets found';
  } else {
    streetNameList.forEach(street => {
      streets.insertAdjacentHTML('afterbegin', `<a href="#" data-street-key="${street.key}">${street.name}</a>`)
    })
  }
}

const updateBusStopTitle = busStop => {
  if(busStop.stops[0] !== undefined) {
    let busStopStreetName = busStop.stops[0].street.name;
    streetTitleName.innerHTML = `Displaying results for ${busStopStreetName}`;
  } else {
    streetTitleName.innerHTML = 'No bus stops to that street name';
  }
}

const nextBusTime = time => {
  const nextBus = new Date(time);
  return nextBus.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

const showSchedules = busScheduleList => {
  busScheduleList.forEach(stop => {
    stop['route-schedules'].forEach(route => {
      route['scheduled-stops'].forEach(time => {
        info.insertAdjacentHTML('afterbegin', 
        `<tr>
          <td>${stop.stop.street.name}</td>
          <td>${stop.stop['cross-street'].name}</td>
          <td>${stop.stop.direction}</td>
          <td>${route.route.number}</td>
          <td>${nextBusTime(time.times.arrival.estimated)}</td>
        </tr>`);
      });
    });
  });
}

const search = document.querySelector('input')
const searchForm = document.querySelector('aside')

searchForm.addEventListener('submit', e => {
  let searchValue = search.value;

  getStreets(searchValue)
    .then(street => returnStreetName(street.streets));
  search.value = '';
  streets.innerHTML = '';
  e.preventDefault();
})

streets.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    info.innerHTML = '';
    getBusStopInfo(e.target.dataset.streetKey);
  }
})
