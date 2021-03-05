const continents = {
  asia: {},
  europe: {},
  americas: {},
  africa: {},
};
const countriesIdentifier = async () => {
    const fetchData = await fetch("https://cors.bridged.cc/https://restcountries.herokuapp.com/api/v1/");
    const country = await fetchData.json();
    country.forEach((e) => {
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
const createChart = (contArg = currentCont, dataType = currentCase) => {
	currentCont = contArg;
	const ctx = document.querySelector('#chart').getContext('2d');
	const labels = Object.keys(continents[contArg]).map(
		(el) => continents[contArg][el].country
	);
	const data = Object.keys(continents[contArg]).map(
		(el) => continents[contArg][el][dataType]
	);
	const chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: `Covid 19 - ${dataType}`,
					backgroundColor: 'rgba(255, 99, 132,0.3)',
					borderColor: '#8D39FA',
					data,
				},
			],
		},
		options: {},
	});
};
const continentButton = document.querySelectorAll('.continents > button')
continentButton.forEach((el) => {
	el.addEventListener('click', (e) => {
        currentCont = e.target.className;
		createChart(currentCont, currentCase);
	});
});

const casesButton = document.querySelectorAll('.cases > button')
casesButton.forEach((el) => {
	el.addEventListener('click', (e) => {
        currentCase = e.target.className; 
		createChart(currentCont, currentCase);
	});
});