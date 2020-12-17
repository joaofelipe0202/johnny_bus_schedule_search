const streets = document.querySelector('.streets');
const info = document.querySelector('tbody'); 
const titleBarName = document.querySelector('.titlebar');

const getStreets = streetName => {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=cmZaYN5yrwwmepOUIVTd&name=${streetName}`)
  .then(response => response.json())
}

const getBusStop = streetKey => {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=cmZaYN5yrwwmepOUIVTd&street=${streetKey}`)
  .then(response => response.json())
  .then(allStops => {
    let allStopSchedule = [];

    allStops.stops.forEach(stop => {
      const busScheduleURL = `https://api.winnipegtransit.com/v3/stops/${stop.key}/schedule.json?api-key=cmZaYN5yrwwmepOUIVTd`
      allStopSchedule.push(fetch(busScheduleURL));
    })
  })
}

function getBusStopData(streetKey) {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=cmZaYN5yrwwmepOUIVTd&street=${streetKey}`)
    .then(response => response.json())
    .then(allStops => {
      const allBusStops = [];

      allStops.stops.forEach(stop => {
        allBusStops.push(
          fetch(`https://api.winnipegtransit.com/v3/stops/${stop.key}/schedule.json?api-key=cmZaYN5yrwwmepOUIVTd`)
            .then(schedule => {
              console.log(schedule[`stop-schedule`]);
            })
        );
      })
    })
}

const returnStreetName = streetNameList => {
  
  if (streetNameList.length === 0) {
    streets.innerHTML = `No Streets found`;
  } else {
    streetNameList.forEach(street => {
      streets.insertAdjacentHTML('afterbegin', `<a href="#" data-street-key="${street.key}">${street.name}</a>`)
    })
  }
}

const search = document.querySelector('input')
const searchForm = document.querySelector('aside')

searchForm.addEventListener('submit', e => {
  const searchValue = search.value;
  e.preventDefault();

  console.log(searchValue);

  getStreets(searchValue)
    .then(street => returnStreetName(street.streets));

  streets.innerHTML = '';
})