var map;
var markers = []; 
var infoWindow;
var allData2 = []

window.onload = () => {
    getData();
}

function initMap() {
  var sydney = {lat: -33.863276, lng: 151.107977};
  map = new google.maps.Map(document.getElementById('map'), {
    center: sydney,		
    zoom: 5,
    mapTypeId: 'roadmap',
	styles: [
	{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
	{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
	{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
	{
	  featureType: 'administrative.locality',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#d59563'}]
	},
	{
	  featureType: 'poi',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#d59563'}]
	},
	{
	  featureType: 'poi.park',
	  elementType: 'geometry',
	  stylers: [{color: '#263c3f'}]
	},
	{
	  featureType: 'poi.park',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#6b9a76'}]
	},
	{
	  featureType: 'road',
	  elementType: 'geometry',
	  stylers: [{color: '#38414e'}]
	},
	{
	  featureType: 'road',
	  elementType: 'geometry.stroke',
	  stylers: [{color: '#212a37'}]
	},
	{
	  featureType: 'road',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#9ca5b3'}]
	},
	{
	  featureType: 'road.highway',
	  elementType: 'geometry',
	  stylers: [{color: '#746855'}]
	},
	{
	  featureType: 'road.highway',
	  elementType: 'geometry.stroke',
	  stylers: [{color: '#1f2835'}]
	},
	{
	  featureType: 'road.highway',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#f3d19c'}]
	},
	{
	  featureType: 'transit',
	  elementType: 'geometry',
	  stylers: [{color: '#2f3948'}]
	},
	{
	  featureType: 'transit.station',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#d59563'}]
	},
	{
	  featureType: 'water',
	  elementType: 'geometry',
	  stylers: [{color: '#17263c'}]
	},
	{
	  featureType: 'water',
	  elementType: 'labels.text.fill',
	  stylers: [{color: '#515c6d'}]
	},
	{
	  featureType: 'water',
	  elementType: 'labels.text.stroke',
	  stylers: [{color: '#17263c'}]
	}
	]    
  });
  infoWindow = new google.maps.InfoWindow()
} 

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
}

const getData = () => {
  fetch("https://corona-api.com/countries", requestOptions) 
  .then((response) => response.json())
  .then((result) => {
  	allData2 = result.data;
	sortCountriesByCasesNumber();
  })
}

function setOnClickListener(){
	var countriesElements = document.querySelectorAll('.country-container')
    countriesElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function sortCountriesByCasesNumber(){
	var countries = allData2;
  	for (let j = 0; j < countries.length - 1; j++) {
	    let max_obj = countries[j];
	    let max_location = j;
	        for (let i = j; i < countries.length; i++) {
	            // if you want to get elements form smaller to bigger just write (< instead >)
	            if (countries[i].latest_data.confirmed > max_obj.latest_data.confirmed) {
	                max_obj = countries[i]
	                max_location = i
	       	     }
	        }
	    countries[max_location] = countries[j]
	    countries[j] = max_obj
		}
	buildData(countries)
}

const buildData = (data) => {
	var countriesHtml = ''
	var countries = data
	showContriesMarkers(countries)
	for (var [index, country] of countries.entries()){
		var name = country.name
		var confirmed = country.latest_data.confirmed
		countriesHtml += `	
            <div class="country-container">
                <div class="country-info-container">
                    <div class="country-name">
                        <span>${name}</span>
                    </div>
                    <div class="country-cases-number">${confirmed} cases</div>
                </div>
            </div>

		`
		document.querySelector('.countries-list').innerHTML = countriesHtml;
	}
	setOnClickListener()
}

function showContriesMarkers(countries){
    var bounds = new google.maps.LatLngBounds();
    for (var [index, country] of countries.entries()){
	console.log(country.coordinates.latitude)
        var latlng = new google.maps.LatLng(
            country.coordinates.latitude,
            country.coordinates.longitude);
        var name = country.name
        var confirmed = country.latest_data.confirmed
        var deaths = country.latest_data.deaths
        var recovered = country.latest_data.recovered
        var critical = country.latest_data.critical
        var updatedAt = moment(country.updated_at.substring(0, 10)).fromNow()
        bounds.extend(latlng);
        createMarker(latlng, name, confirmed, deaths, recovered, critical, index+1, updatedAt);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, confirmed, deaths, recovered, critical, index, updated_at) {
  var html = `
  	<div class="country-name-window">${name}</div>
  		<hr>
  	<div class="country-info">
  		<div class="elements">
  			<i class="fas fa-lungs-virus"></i>
  			<span class="elemets-span">Cases: ${confirmed}</span>
  		</div>
  		<div class="elements">
	  		<i class="fas fa-skull-crossbones"></i>
	  		<span class="elemets-span">Deaths: ${deaths}</span>
	  	</div>
	  	<div class="elements">	
	  		<i class="fas fa-smile"></i>
	  		<span class="elemets-span">Recovered: ${recovered}</span> <br>
  		</div>
  		<div class="elements">	
  			<i class="fas fa-surprise"></i>	
	  		<span class="elemets-span">Critical: ${critical}</span>
	  	</div>	
	  	<hr>
  		<div class="elements">	
	  		<span class="elemets-span" style="margin: 5px 0 5px 0">Updated: ${updated_at}</span>
	  	</div> <br>
  	</div>	
	
  `
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: {
      url: "https://img.icons8.com/nolan/32/coronavirus.png"
    }
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}