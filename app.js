const streets = document.querySelector('.streets');

const getStreets = streetName => {
  return new Promise((resolve, reject) => {
  const streetRequest = new XMLHttpRequest();
 
streetRequest.addEventListener('readystatechange', () => {
  if(streetRequest.readyState === 4 && streetRequest.status === 200) {
    resolve(JSON.parse(streetRequest.responseText));
    } else if (streetRequest.readyState === 4) {
    reject('No street found');
    }
  })
 
streetRequest.open('GET', `https://api.winnipegtransit.com/v3/streets.json?api-key=cmZaYN5yrwwmepOUIVTd&name=${streetName}`);
streetRequest.send();
  });
}

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
 
