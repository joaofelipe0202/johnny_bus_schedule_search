const streets = document.querySelector('.streets');
const info = document.querySelector('tbody'); 

const getStreets = streetName => {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=cmZaYN5yrwwmepOUIVTd&name=${streetName}`)
  .then(response => response.json())
}

const getBusStop = streetKey => {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=cmZaYN5yrwwmepOUIVTd&street=${streetKey}`)
  .then(response => response.json())
}

const getBuses = busStop => {
  const allBuses = [];

  busStop.forEach(stopKey => {
    allBuses.push(fetch(`https://api.winnipegtransit.com/v3/stops/${stopKey}/schedule.json?api-key=cmZaYN5yrwwmepOUIVTd`))
  })

  console.log(allBuses);
}

const getStreetsData = streetName => {
  getStreets(streetName).then(allStreetName => {
    const streetKey = allStreetName.streets[0].key
    console.log(streetKey);

    return streetKey;
  })
}

const getStopData = key => {
  getBusStop(key).then(allStops => {
    let allBusStop = [];

    allStops.stops.forEach(stop => {
      allBusStop.push(stop.key);
    });
    console.log(allBusStop)
    return allBusStop;
  })
}

//getStopData('2715')
getBuses('10003')






//getStreetsData('Kenaston');















const returnStreetName = streetName => {
  streetName.forEach(street => {
    streets.insertAdjacentHTML('afterbegin', `<a href="#" data-street-key="${street.key}">${street.name}</a>`)
  })
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