window.onload = () => {
    getPosts();
}

var map;
var markers = [];
var infoWindow;

function initMap() {
  var sydney = {lat: -33.863276, lng: 151.107977};
  map = new google.maps.Map(document.getElementById('map'), {
    center: sydney,		
    zoom: 5,
    mapTypeId: 'roadmap',
  });
  infoWindow = new google.maps.InfoWindow()
} 

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

const getPosts = () => {
  fetch("https://corona-api.com/countries", requestOptions) 
  .then((response) => response.json())
  .then((result) => {
  	buildData(result)
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

const buildData = (data) => {
	var countriesHtml = ''
	var countries = data.data
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
        var latlng = new google.maps.LatLng(
            country.coordinates.latitude,
            country.coordinates.longitude);
        var name = country.name
        var confirmed = country.latest_data.confirmed
        var deaths = country.latest_data.deaths
        var recovered = country.latest_data.recovered
        var critical = country.latest_data.critical
        var updatedAt = moment(country.updated_at.substring(0, 10)).fromNow()
        console.log(updatedAt.length)
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
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}