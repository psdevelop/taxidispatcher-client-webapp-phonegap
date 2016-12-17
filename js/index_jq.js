			
			$(document).ready(function (){
				//$('#popupDialog').popup('open');
			});
			$( document ).on( "pageinit", "#main-page", function() {
				//alert("pageinit");
				//$("#popupDialog").popup("open");
			});
			$( document ).on( "pageshow", "#main-page", function() {
				//alert("pageshow");
				//$("#popupDialog").popup("open");
				//setTimeout(function()	{
				//	if (localStorage.tdClientPhone)
				//		$("#popupDialog").popup("open");
				//	}, 3000 );
			});
			$( document ).on( "pagecreate", "#main-page", function() {

				$( document ).on( "swipeleft swiperight", "#main-page", function( e ) {
					// We check if there is no open panel on the page because otherwise
					// a swipe to close the left panel would also open the right panel (and v.v.).
					// We do this by checking the data that the framework stores on the page element (panel: open).
					if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
						if ( e.type === "swipeleft" ) {
							//$('#popupDialog').popup('open');
							$( "#add-form" ).panel( "open" );
						} else if ( e.type === "swiperight" ) {
							$( "#nav-panel" ).panel( "open" );
						}
					}
				});
			});
			
			$(function() {
				$( "[data-role='navbar']" ).navbar();
				$( "[data-role='header'], [data-role='footer']" ).toolbar();
			});
			// Update the contents of the toolbars
			$( document ).on( "pagecontainerchange", function() {
				// Each of the four pages in this demo has a data-title attribute
				// which value is equal to the text of the nav button
				// For example, on first page: <div data-role="page" data-title="Info">
				var current = $( ".ui-page-active" ).jqmData( "title" );
				// Change the heading
				$( "[data-role='header'] h1" ).text( current );
				// Remove active class from nav buttons
				$( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
				// Add active class to current nav button
				$( "[data-role='navbar'] a" ).each(function() {
					if ( $( this ).text() === current ) {
						$( this ).addClass( "ui-btn-active" );
					}
				});
			});
			
			$( document ).on( "click", ".send_order", function() {
				var $this = $( this ),
					theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
					msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
					textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
					textonly = !!$this.jqmData( "textonly" );
					html = $this.jqmData( "html" ) || "";
				$.mobile.loading( "show", {
						text: "Отправка данных",
						textVisible: true,
						theme: "b",
						textonly: textonly,
						html: html
				});
			})
			.on( "click", ".hide-page-loading-msg", function() {
				$.mobile.loading( "hide" );
			});
			
			/*
			 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
			 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
			 */
			 
			//$( document ).on( "pageshow", "#map-page", function() {
				//alert("pageshow");
				//$("#popupDialog").popup("open");
				//setTimeout(function()	{
				//	if (localStorage.tdClientPhone)
				//		$("#popupDialog").popup("open");
				//	}, 3000 );
			//});

			$( document ).on( "pageshow", "#map-page", function() { //pagecreate
				var defaultLatLng = new google.maps.LatLng(45.364585, 40.211350);  // Default to Hollywood, CA when no geolocation support

				var myLon=40.211350, mylat=45.364585;
				if ( navigator.geolocation ) {
					function success(pos) {
						// Location found, show map with these coordinates
						mylat=pos.coords.latitude;
						myLon=pos.coords.longitude;
						drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
					}

					function fail(error) {
						alert('Ошибка определения координат!');
						drawMap(defaultLatLng);  // Failed to find location, show default map
					}

					// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
					navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
				} else {
					alert('Устройство не поддерживает определения координат!');
					drawMap(defaultLatLng);  // No geolocation support, show default map
				}

				function drawMap(latlng) {
					var myOptions = {
						zoom: 11,
						center: latlng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

					var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
					
					var addres = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+mylat+','+myLon+'&sensor=false&language=ru';
					$.getJSON( addres, { }, function(data) {

						var marker = new google.maps.Marker({
							position: latlng,
							map: map,
							title: "Greetings!!!"
						});
						
						try		{
						$('#enter-stadr-menu').html('Указать адрес ('+data['results'][0]['formatted_address']+')');
						$('#start-adr-entered').val(data['results'][0]['formatted_address']);
						
						var contentString = '<div id="content" style="min-height:100px;"><center>'+data['results'][0]['formatted_address']+'<br/><a href="#" data-rel="back" class="ui-link ui-btn-left ui-btn ui-shadow ui-corner-all" data-role="button" role="button" style="margin:15px;">OK</a></center><br/></div>';//
						var infowindow = new google.maps.InfoWindow({
							content: contentString
						});
						
						infowindow.open(map,marker);
						} catch(e)	{
							alert('Ошибка извлечения адреса!');
						}
						
						map.setZoom(13);
					}).fail(function() {
						alert('Ошибка запроса адреса по координатам!');
					});

					
				}

			});