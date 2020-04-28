const locate = document.getElementById('locate'),
 people = document.getElementById('people'),
 gender = document.getElementById('gender'),
 diversity = document.getElementById('diversity'),
 income = document.getElementById('income'),
 city = document.getElementById('city'),
 state = document.getElementById('state'),
 age = document.getElementById('age'),
 submit = document.getElementById('submit');
let newzip = document.getElementById('newzip');
let zipcode = '';
let dataPoints = [];

function getData() {
	let myzip = locate.innerText;
	let demographicData = `https://geodata.cdxtech.com/api/geodemographics?key=${KEY}&zipcode=${myzip}&format=json`
	let genderData = `https://geodata.cdxtech.com/api/geogender?key=${KEY}&zipcode=${myzip}&format=json`
	let diversityData = `https://geodata.cdxtech.com/api/georace?key=${KEY}&zipcode=${myzip}&format=json`

	const requestOne = axios.get(demographicData);
	const requestTwo = axios.get(genderData);
	const requestThree = axios.get(diversityData);

	axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
		const responseOne = responses[0].data.results
		const responseTwo = responses[1].data.results
		const responseThree = responses[2].data.results
	  	
	  	// Demographic
		city.innerText = "You are near: " + responseOne.city + ",";
		state.innerText = responseOne.state;
		people.innerText = `There are about ${responseOne.populationEstimate} people in your area.`;
		salary = Math.round(responseOne.incomePerHousehold / responseOne.personsPerHousehold);
		income.innerText = `A person in your area makes about $ ${salary} a year.`;
		age.innerText = `Average age is about: ${responseOne.medianAge} years old.`;
		// Gender
		gender.innerHTML = `<p>Male: <span>${responseTwo.malePercentage}%</span></p><p>Female: <span>${responseTwo.femalePercentage}%</span></p>`;
		// Diversity
		races = { White: responseThree.whitePercentage, Black: responseThree.blackPercentage, Asian: responseThree.asianPercentage, Hawaiian: responseThree.hawaiianPercentage, Indian: responseThree.indianPercentage, Other: responseThree.otherPercentage};
		dataPoints = [];
		Object.keys(races).sort((a, b) => {
			return races[b] - races[a] 
		}).forEach(function(value, index) {
			let obj = {};
			obj["y"] = races[value];
			obj["label"] = value;
			dataPoints.push(obj);
		});

		CanvasJS.addColorSet("shades",
			[//colorSet Array
			"#5f4090",
			"#FFC107",
			"#4CAF50",
			"#00BCD4",
			"#E91E63",
			"#9E9E9E"
			]);

		let chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			colorSet: "shades",
			data: [{
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00\"%\"",
				indexLabel: "{label} {y}",
				dataPoints: dataPoints
			}]
		});
		chart.render();

	})).catch(errors => {
	  alert("Not found. Try again.")
	});
}

document.getElementById('submit').addEventListener("click", function(){
	locate.innerText = newzip.value;
	getData();
});