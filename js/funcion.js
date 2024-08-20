//

let map = L.map('map').setView([19.40, -99.11], 8);

var osm_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"></a>',
		maXZoom : 20,
		minZoom: 3
}).addTo(map);

var pobmap = L.tileLayer('https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

function infoclick(feature,
	layer){
	layer.bindPopup("<p>El municipio de "+ feature.properties.NOMGEO + " cuenta con <b> " + feature.properties.POSITIVOS + "</b> casos confirmados</p>");
	}

function infohosp(feature,
	layer) {
	layer.bindPopup(
		"<p>" + feature.properties.Name +"</p>" 
	+ "<p>"+feature.properties.Agencia+ "</p>"
		+ "<p>" + feature.properties.Des_age + "</p>"
		+ "<a href="+ feature.properties.coordinates +">Ver en Google Maps</a>"
		
	);
}

function getColorest(POSITIVOS){
	if (parseInt(POSITIVOS) <= 30){
			return 'rgb(255, 245, 240)';
		} else if (parseInt(POSITIVOS) <= 59 && parseInt(POSITIVOS) > 30 ){
			return 'rgb(253, 190, 165)';
		} else if (parseInt(POSITIVOS) <= 88 && parseInt(POSITIVOS) > 59) {
			return 'rgb(252, 112, 80)';
		} else if (parseInt(POSITIVOS) <= 117  && parseInt(POSITIVOS) > 88) {
			return 'rgb(212, 32, 32)';
		}else{
			return 'rgb(103, 0, 13)';
		}
	}

function StyleFeature(feature){
		return{
			fillColor: getColorest(feature.properties.POSITIVOS),
			weight : 0.5,
			color : 'rgba(0, 0, 0, 1)',
			fillOpacity : 0.7
		}
	}


var estadosLayer = L.geoJson(america, {
	style: {
		fillColor: 'rgba(0,0,0,0.1)',
		fillOpacity: 0.9,
		weight: 0.5,
		color: 'rgba(50,100,200,1)',
	}
}).addTo(map);


/*var dataLayer = L.geoJson(munic,{
		style: StyleFeature,
		onEachFeature: infoclick
	}).addTo(map);*/

var hospitalesLayer = L.geoJson(ae,{
		onEachFeature:infohosp
	});

//var edomexLayer = L.geoJson(edomexl);
	
map.fitBounds(estadosLayer.getBounds());

var baseMaps ={
		"Open Street Map": osm_map,
		"Topográfico": pobmap
	};

L.control.layers(baseMaps).addTo(map);

var legend = L.control({
		position : 'bottomright'
	});

legend.onAdd = function(map){
		var div =L.DomUtil.create('div','legend');
		var labels = [
			"0  - 30",
			"30 - 59",
			"59 - 88",
			"88 - 117",
			"117 - 146"
		];
	var grades = [30, 59, 88, 117, 146];
	div.innerHTML = '<p><b>Casos confirmados</b></p>';
		for (var i = 0; i < grades.length; i ++){
			div.innerHTML += '<i style="background:' 
			+ getColorest(grades[i]) + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;'
			+ labels[i] + '<br/>';
		}
		return div;
	}

legend.addTo(map);

$("#hospitales").click(function () {
	if (map.hasLayer(hospitalesLayer)) {
			map.removeLayer(hospitalesLayer)
		} else {
			map.addLayer(hospitalesLayer);
		};
	});

$("#confirmados").click(function () {
		if (map.hasLayer(dataLayer)) {
			map.removeLayer(dataLayer)
		} else {
			map.addLayer(dataLayer);
		};
	});

