const continents = {
  asia: {},
  europe: {},
  americas: {},
  africa: {},
  world: {},
};
// getting specific data on country with country-code
const countryCode = {};
const countriesIdentifier = async () => {
    const fetchData = await fetch("https://cors.bridged.cc/https://restcountries.herokuapp.com/api/v1/");
    const country = await fetchData.json();
    console.log(country);
    country.forEach((e) => {
        continents.world[e.cca2] = { country: e.name.common };
        if (e.region === "Asia") {
          continents.asia[e.cca2] = { country: e.name.common };
        } else if (e.region === "Europe") {
          continents.europe[e.cca2] = { country: e.name.common };
        } else if (e.region === "Americas") {
          ;continents.americas[e.cca2] = { country: e.name.common }
        } else {
          continents.africa[e.cca2] = { country: e.name.common };
        }
        
    })
    countriesCovidData().catch((err) => console.log(err));
}
countriesIdentifier().catch((err) => console.log(err));

const countriesCovidData = async () => {
    const fetchData = await fetch("https://corona-api.com/countries");
    const country = await fetchData.json();
    console.log(country.data);
    Object.keys(continents).forEach((cont) => {
        country.data.forEach((el) => {
            if (!continents[cont][el.code]) {
                return;
            }
            continents[cont][el.code].confirmed = el.latest_data.confirmed;
            continents[cont][el.code].critical = el.latest_data.critical;
            continents[cont][el.code].deaths = el.latest_data.deaths;
            continents[cont][el.code].recovered = el.latest_data.recovered;
            continents[cont][el.code].today = {
                confirmed: el.today.confirmed,
                deaths: el.today.deaths,
            };
        });
    });
};

let currentCont = 'americas';
let currentCase = 'confirmed';
const countriesContainer = document.querySelector('.countries-container');

//! create chart
const ctx = document.querySelector('#chart').getContext('2d');
const chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: ``,
				backgroundColor: 'rgba(255, 99, 132,0.3)',
				borderColor: '#8D39FA',
				data: [],
			},
		],
	},
});

//! update chart
const updateChart = (contArg = currentCont, dataType = currentCase) => {
    countriesContainer.innerHTML = '';
	currentCont = contArg;
	const labels = Object.keys(continents[contArg]).map((el) => continents[contArg][el].country);
    chart.data.labels = labels;
	const data = Object.keys(continents[contArg]).map((el) => continents[contArg][el][dataType]);
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = `Covid 19 - ${dataType}`;

    // create countris list
    counter = 0;
    for (let i = 0; i < labels.length / 10; i++) {
        const ul = document.createElement('ul');
        ul.classList.add('counties-list');
        for (let j = 0; j < 10; j++) {
            const li = document.createElement('li');
            li.classList.add('country');
            li.textContent = labels[counter];
            ul.appendChild(li);
            counter++
        }
        countriesContainer.appendChild(ul)
    }
    chart.update();
};

const displayCases = document.querySelector('.cases')
const continentButton = document.querySelectorAll('.continents > button')
const canvas = document.querySelector('canvas');
const countryDetailsContainer = document.querySelector('.country-details-container');
const chartContainer = document.querySelector('.chart-container');

// boxes of data per country
const totalCases = document.querySelector('.total-cases > h2');
const totalDeaths = document.querySelector('.total-deaths > h2');
const recovered = document.querySelector('.total-recovered > h2');
const newCases = document.querySelector('.new-cases > h2');
const newDeaths = document.querySelector('.new-deaths > h2');
const critical = document.querySelector('.critical > h2');

continentButton.forEach((cont) => {
    cont.addEventListener('click', (e) => {
        displayCases.style.visibility = 'visible';
        canvas.style.visibility = 'visible';
        currentCont = e.target.className;
		updateChart(currentCont, currentCase);
        const country = document.querySelectorAll('.country');
        country.forEach((country) => {
            country.addEventListener('click', (e) => {
                countryDetailsContainer.style.display = 'block';
                chartContainer.style.display = 'none';
                const header = document.querySelector('.country-details-container .header');
                header.textContent = e.target.textContent;
                Object.values(continents[cont.textContent.toLocaleLowerCase()]).forEach((data)=> {
                    if (data.country === e.target.textContent) {
                        totalCases.textContent = data.confirmed;
                        newCases.textContent = data.today.confirmed;
                        totalDeaths.textContent = data.deaths;
                        newDeaths.textContent = data.today.deaths;
                        recovered.textContent = data.recovered;
                        critical.textContent = data.critical;
                    }
                });
            })
        })
	});
});

const casesButton = document.querySelectorAll('.cases > button')
casesButton.forEach((el) => {
	el.addEventListener('click', (e) => {
        displayCases.style.visibility = 'visible';
		canvas.style.visibility = 'visible';
        currentCase = e.target.className; 
		updateChart(currentCont, currentCase);
	});
});

//! back btn
const backButton = document.querySelector('.back-btn');
backButton.addEventListener('click', (e) => {
    countryDetailsContainer.style.display = 'none';
	chartContainer.style.display = 'block';
})