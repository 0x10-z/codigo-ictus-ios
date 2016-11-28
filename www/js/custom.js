var DISCLAIMERISACCEPT;
$(document).on('ready', function(){
	 setTimeout(function () {
        navigator.splashscreen.hide();
    }, 3000);
	loadHospitals();
	loadSettings();
	$(function() {
    FastClick.attach(document.body);
	});
	

	$('.nav-button').on('click', function(e){
		direction = $(this).attr('nav-direction');
		console.log(direction);
		if(direction=='test-ries' && !DISCLAIMERISACCEPT){
			openDisclaimer(e);
			return false;
		}
		window.location.href = '#'+direction;
	})
	//derecha
	$('.senales').on('swipeleft',function(e){
		senNumber = parseInt(this.id.substr(this.id.length-1));
		if(senNumber < 5){
			console.log(senNumber);
			window.location.href = '#sen-'+(senNumber+1);
		}
	});
	//izquierda
	$('.senales').on('swiperight',function(e){
		senNumber = parseInt(this.id.substr(this.id.length-1));
		if(senNumber > 1){
			console.log(senNumber);
			window.location.href = '#sen-'+(senNumber-1);
		}
	});

  	$("#submit-test").on("tap", function(e){
    e.preventDefault();
    formElements = $("#form-test").serializeArray();
    lowRisk =new Array();
    mediumRisk = new Array();
    highRisk = new Array();
    for(var key in formElements){
      answered = formElements[key]['value'].toString().substring(1,2);
      if(answered == 1){
        highRisk.push(answered);
      }else if(answered == 2){
        mediumRisk.push(answered);
      }else{
        lowRisk.push(answered);
      }
    }
    if(highRisk.length >= 3){
        title = "¡Cuidado!";
        result = "Consulte de inmediato acerca de la prevención del ACV.";   
    }else if(mediumRisk.length >= 4){   
        title = "No esta mal";
        result = "Bueno... Buen comienzo. Procure reducir su riesgo.";
    }else{
        title = "¡Genial!";
        result = "Tiene muy bien controlado su riesgo de sufrir un ACV.";
    }
    console.log("high risk: "+highRisk.length+" / medium risk: "+mediumRisk.length+" / low risk: "+lowRisk.length);
    console.log(result);
    navigator.notification.alert(result, callback, title, "Aceptar");
  });

});
function onConfirmDisclaimer(index){
	if(index==1){
		localStorage.setItem('disclaimerIsAccept', true);
		DISCLAIMERISACCEPT = true;
		window.location.href = "#test-ries";
	}else{
		window.location.href = "#init";
	}
}
function callback(){

}

function openDisclaimer(e){
	e.preventDefault();
	title = "Disclaimer";
	message = "Por favor, lea este Acuerdo de Consentimiento cuidadosamente antes de acceder o utilizar  este 'Cálculo de Riesgo'. Al acceder o utilizar este sitio, usted acepta que quedará\ vinculado por los siguientes términos y condiciones. Si usted no esta dispuesto a ser limitado por los términos y condiciones no haga esta evaluación de riesgo de ictus.\
	\ Esta información no sustituye los consejos médicos :\
	\ La información y los materiales contenidos en esta aplicación tienen un carácter puramente informativo y no sustituyen en ningún caso la consulta médica o el asesoramiento profesional,\ recomendación, diagnóstico o tratamiento. Por favor, consulte a su médico u otro proveedor de atención sanitaria para recomendaciones médicas. Aún cuando creemos que la información está actualizada\ y fiable, no podemos garantizarlo.\
	\ La Alianza General de Pacientes no se hace responsable ante usted en cualquier información obtenida a través del uso de este sitio, y no reclamará ninguna responsabilidad en relación\
	dicha información y los servicios que puede recibir de cualquier proveedor de atención sanitaria a través de esta aplicación.\
	\ El Cálculo de Riesgo fue proporcionado por © 2014 National Stroke Association. Reproducido con permiso. Por favor, visita www.stroke.org para recursos educativos sobre ictus.\
	\ Gracias por tomarse el tiempo en leer esto, y por dar un paso para mejorar su salud mediante la evaluación de su riesgo de ictus!";
	navigator.notification.confirm(message,onConfirmDisclaimer, title, 'Acepto, No lo acepto');
}

function loadSettings(){
	settings = localStorage.getItem('disclaimerIsAccept');
	if(settings != null){
		DISCLAIMERISACCEPT = true;
	}else{
		DISCLAIMERISACCEPT = false;	
	}
}


function loadHospitals(){
	html = '';
	jsonHospitals = JSON.parse(hospitalsJson);
	for(var ciudad in jsonHospitals.ComunidadesAutonomas){
		html+='<div data-role="collapsible">';
		html +='<h3>'+ciudad+'</h3>';
		for(var hospital in jsonHospitals.ComunidadesAutonomas[ciudad]){
			html += '<h3>'+hospital+'</h3>';
			html += '<p>'+jsonHospitals.ComunidadesAutonomas[ciudad][hospital]+'</p>';
      html += '<div style="width:69px;">'
      html += "<a data-icon='navigation' style='border-radius:19px' data-iconpos='left' data-role='button' onclick='launNav(\""+jsonHospitals.ComunidadesAutonomas[ciudad][hospital]+"\")'>ir</a>";
			html += '</div>'
      //console.log(jsonHospitals.ComunidadesAutonomas[ciudad][hospital]);
		}
		html += '</div>';
	}
	$('#hospitals-json').html(html);
}

function launNav(destination){
	launchnavigator.navigate(destination,null,function(){}, function(e){},{preferGoogleMaps: true,transportMode: "transit"});
}

function phoneCall(){
	navigator.notification.confirm("¿Está seguro? Recuerde activar 'CÓDIGO ICTUS'",
		function(index){
			if(index==1){
				window.open("tel:112",'_system');
			}else{
				return false;
			}
		},
		 "Llamada de emergencia", 'Si, No');
	return false;
}

function shared(){
	window.plugins.socialsharing.share('¡Me he descargado Código Ictus del App Store!',
      'Código Ictus',
      'http://ikerocio.com/privacy/codigoictus.png', // check the repo for other usages
      'https://itunes.apple.com/es/app/codigo-ictus/id1045900494?mt=8');
	return false;
}

