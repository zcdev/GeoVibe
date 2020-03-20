const KEY = config.KEY;
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

function getDemoData() {
	let myzip = locate.innerText;
  	const geodemographicsURL = `https://geodata.cdxtech.com/api/geodemographics?key=${KEY}&zipcode=${myzip}&format=json`;
	axios.get(geodemographicsURL).then((response) => {
	    data = response.data.results;
	    city.innerText = "You are near: " + data.city + ",";
	    state.innerText = data.state;
	    people.innerText = `There are about ${data.populationEstimate} people in your area.`;
	    salary = Math.round(data.incomePerHousehold / data.personsPerHousehold);
	    income.innerText = `A person in your area makes about $ ${salary} in a year.`;
	    age.innerText = `Average age is about: ${data.medianAge} years old.`;
	    console.log(data);
}).then(() => {
	let myzip = locate.innerText;
	const genderURL = `https://geodata.cdxtech.com/api/geogender?key=${KEY}&zipcode=${myzip}&format=json`;
		axios.get(genderURL).then((response) => {
		    data = response.data.results;
		    gender.innerHTML = `<p>Male: <span>${data.malePercentage}%</span></p><p>Female: <span>${data.femalePercentage}%</span></p>`;
		    console.log(data);
		});
	});
}

function getDiversity() {
	let myzip = locate.innerText;
	const raceURL = `https://geodata.cdxtech.com/api/georace?key=${KEY}&zipcode=${myzip}&format=json`;
	axios.get(raceURL).then((response) => {
    data = response.data.results;
    races = { White: data.whitePercentage, Black: data.blackPercentage, Asian: data.asianPercentage, Hawaiian: data.hawaiianPercentage, Indian: data.indianPercentage, Other: data.otherPercentage};
dataPoints = [];
Object.keys(races).sort((a, b) => {
	return races[b] - races[a] 
}).forEach(function(value, index) {
let obj = {};
obj["y"] = races[value];
obj["label"] = value;
dataPoints.push(obj);
});

console.log(dataPoints)
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
    console.log(data);
}).catch(err => console.log(err));

}

document.getElementById('submit').addEventListener("click", function(){
	locate.innerText = newzip.value;
 	getDemoData();
 	getDiversity();
});