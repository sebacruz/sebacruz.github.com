<!doctype html>
<html class="no-js" lang="es">
	<head>
		<meta charset="utf-8" />
		<title>Google Maps</title>
		<link rel="stylesheet" href="../assets/css/styles.css" />
		<style>
		#wrap {
			bottom:0;
			left:0;
			position:absolute;
			right:0;
			top:5.8em;
		}
		
		#search {
			position:absolute;
			right:1em;
			top:1em;
			z-index:10;
		}
		
		#map {
			height:100%;
			width:100%;
		}
		</style>
	</head>
	<body>
		<header>
			<h1>Google Maps</h1>
		</header>
		<div id="search">
			<input id="input" type="text" />
			<input id="submit" type="submit" value="Buscar" />
		</div>
		<section id="wrap">
			<div id="map"></div>
		</section>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="assets/js/jquery.min.js?v1.6.1">\x3C/script>')</script>
		<script src="//maps.google.com/maps/api/js?sensor=false&language=es"></script>
		<script>
		$(document).ready(function(){
			var input = $('#input'),
				map_area = $('#map'),
				pointer,
				
				// Iniciamos el mapa sin los controles por default
				// http://code.google.com/intl/es-ES/apis/maps/documentation/javascript/controls.html
				map = new google.maps.Map(map_area[0], {
						streetViewControl: false,
						mapTypeControl: false,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						zoom: 8
					}),
					
				// Geocoder instance
				geocoder = new google.maps.Geocoder(),
				
				// Google bounds instance
				bounds = new google.maps.LatLngBounds(),
				
				// Default center (Buenos Aires)
				center = new google.maps.LatLng(-34.608333, -58.371944);
			
			// Sets default center
			map.setCenter(center);
			
			$('#submit').click(function(){
				var address = input.val();
				if (address.length == 0)
					return false;
				
				geocoder.geocode({'address': address}, function(results, status){
					if (status == google.maps.GeocoderStatus.OK) {
						
						// Resetea el mapa
						// http://code.google.com/intl/es-ES/apis/maps/documentation/javascript/overlays.html#RemovingOverlays
						if (pointer != null)
							pointer.setMap(null);
						
						// Trabajamos con el primer resultado
						var position = results[0].geometry.location;
						
						// Crea el puntero y lo agrega al mapa
						pointer = new google.maps.Marker({
							position: position,
							map: map,
							draggable: false
						});
						
						// Centramos el mapa en el puntero
						map.setCenter(position);
						
						// Damos mas zoom al mapa
						map.setZoom(10);
						
						// Para mostrar varios resultados
						/*
						var i = results.length;
						while (i--) {
						}
						//*/
						
					} else {
						alert('No se encuentra esa dirección.');
					}
				});
			});
		});
		</script>
	</body>
</html>
