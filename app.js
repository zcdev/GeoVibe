const KEY_1 = config.KEY_1;
const KEY_2 = config.KEY_2;
const locate = document.getElementById('locate');
const gender = document.getElementById('gender');
const race = document.getElementById('race');
let zipcode = '';

const ipURL = `https://api.ipgeolocation.io/ipgeo?apiKey=${KEY_1}`;
	axios.get(ipURL).then((response) => {
    data = response.data;
    zipcode = data.zipcode.slice(0, 5);
    locate.innerText = zipcode;
}).then(() => {
  	const geodemographicsURL = `https://geodata.cdxtech.com/api/geodemographics?key=${KEY_2}&zipcode=${zipcode}&format=json`;
	axios.get(geodemographicsURL).then((response) => {
    data = response.data;
    console.log(data);
}).then(() => {
	const genderURL = `https://geodata.cdxtech.com/api/geogender?key=${KEY_2}&zipcode=${zipcode}&format=json`;
	axios.get(genderURL).then((response) => {
    data = response.data.results;
    gender.innerHTML = `<p>Male: ${data.malePercentage}%</p><p>Female: ${data.femalePercentage}%</p>`;
    console.log(data);
}).then(() => {
	const raceURL = `https://geodata.cdxtech.com/api/georace?key=${KEY_2}&zipcode=${zipcode}&format=json`;
	axios.get(raceURL).then((response) => {
    data = response.data.results;
    races = { White: data.whitePercentage, Black: data.blackPercentage, Asian: data.asianPercentage, Hawaiian: data.hawaiianPercentage, Indian: data.indianPercentage, Other: data.otherPercentage};

    dominance = Object.keys(races)
    .map((key) => ({key, value: races[key]}))
    .sort((a, b) => b.key.localeCompare(a.key))
    .reduce((acc, e) => {
      acc[e.key] = e.value;
      return acc;
    }, {});
for (var key of Object.keys(dominance)) {
    race.innerHTML += key + " (" + dominance[key] + "%), ";
}
    console.log(data);
	}).catch(err => console.log(err));
})
})
});