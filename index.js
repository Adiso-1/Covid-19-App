const continents = {
  asia: {},
  europe: {},
  americas: {},
  africa: {},
  world: {},
};
const countriesIdentifier = async () => {
    const fetchData = await fetch("https://cors.bridged.cc/https://restcountries.herokuapp.com/api/v1/");
    const country = await fetchData.json();
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

continentButton.forEach((el) => {
	el.addEventListener('click', (e) => {
        displayCases.style.visibility = 'visible';
        canvas.style.visibility = 'visible';
        currentCont = e.target.className;
		updateChart(currentCont, currentCase);
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
