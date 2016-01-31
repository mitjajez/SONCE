/* ########## upravljanje z dogodki ########## */

// funkcija onemogoči vse dogodke in pusti le dogodke za dodajanje elementov
$.cancelWire = function() {
	$('#svg').removeClass('wire').unbind('click.wire').unbind('dblclick.wire').unbind('mousemove.wire').unbind('mousemove.X');
	if( $('#wire').exists() ) $("#svg").svg("get").remove( $('#wire') );
	if( $('#X').exists() ) $("#svg").svg("get").remove( $('#X') );
	if( $('.active').exists() )	$('.active').openThisPin();
}

// funkcija odprto povezavo (#wire) shrani in preimenuje.
// prekine miškino premikanje
$.finishWire = function(pin){
	var pin2 = $('#wire').attr('class').baseVal
	$('#svg').unbind('mousemove.wire');
	$('#wire').attr('id', 'w'+wirecount);
	$('#w'+wirecount).setClassSVG(pin2 + ' ' + pin);
	$('#w'+wirecount).onWire();
	console.debug($('#w'+wirecount));
	//BUILD CIRCUIT ##########
	$.addNode('w'+wirecount);

	wirecount++;
	$.updateCode();
}

$.fn.connectThisPin = function(){
	$(this).each(function(){
		if( $(this).hasClassSVG("pin") ){
			$(this).setClassSVG('pin conn');
			$('.conn').unbind('mouseenter.onPin');
		}
		else if( $(this).attr('id')[0] == "w" ){
			$(this).removeClassSVG("active");
		}
		else if( $(this).attr('id')[0] == "n" ){
			$(this).removeClassSVG("active");
		}
	});
}

$.fn.openThisPin = function(){
	$(this).each(function(){
		if( $(this).hasClassSVG("pin") ){
			$(this).setClassSVG('pin open')
			$('.open').bind('mouseenter.pin');
		}
		else if( $(this).attr('id')[0] == "w" ){
		}
		else if( $(this).attr('id')[0] == "n" ){
		}
	});

}

/* ########## upravljanje z risanjem ########## */
// funkcija narise kriz cez celotno povrsino
// in ga premika glede na pozicijo misi
$.cross = function(){
	var svg = $("#svg").svg("get");
	var off = $('#svg').offset();
	var dot = $.snap( -off.left, -off.top);
	var path = svg.createPath();
	svg.path("M" + dot.x +',0 V'+$('#svg').height() 
		+ ' M0,' + dot.y +' H'+ $('#svg').width(), {'id': 'X'});
	$('#svg').bind('mousemove.X',function(e){
		var dot = $.snap(e.pageX - off.left,e.pageY - off.top);
		var Xd = $('#X').attr('d').split(' ');
		Xd[0] = 'M'+ dot.x +',0';
		Xd[2] = 'M0,'+ dot.y;
		var svg = $("#svg").svg("get");
		var X = svg.getElementById("X");
		svg.change( X, {d: Xd.join(" ")});
		$.updateCode();
	})
	.css('cursor','crosshair');
}

$.onPin = function(){
	$('.pin').bind('mouseenter.onPin', function(e){
		var svg = $("#svg").svg("get");
		if($('#connect').exists())
			$('#connect').removeSVG();
		var cpos = {'cx':$(this).attr('cx').baseVal.value,
					'cy':$(this).attr('cy').baseVal.value };
		var connect = svg.circle( cpos.cx, cpos.cy, 13,
				{'id':"connect","class":$(this).attr('id')});
		$('#connect').mouseleave(function(e){
			$('#connect').removeSVG();
			$(document).unbind('mousemove.onPinConnect');
		});
	});
}
$.fn.onWire = function(){
	$(this).bind('mouseenter.onWire', function(e){
		if($('#connect').exists())
			$('#connect').removeSVG();
		var svg = $("#svg").svg("get");
		var off = $('#svg').offset();
		var dot = $.snap(e.pageX - off.left,e.pageY - off.top);
		var connect = svg.circle( dot.x, dot.y, 13,
				{'id':"connect","class":$(this).attr('id')});
		$('#connect').mouseleave(function(e){
			$('#connect').removeSVG();
			$(document).unbind('mousemove.onWireConnect');
		});
	});
}

$.fn.addNewWirePoint = function(dot){
	// ob VSAKEM kliku dodamo (vsaj eno) novo točko.
	var points = $('#wire').attr('d').split(" ");
	var wireMode = $('.selected').attr('id');
	if(wireMode == 'lin'){
		points[points.length] = 'L' + dot.x + ',' + dot.y;
	}
	else if (wireMode == 'vh'){
		points[points.length] = 'V' + dot.y;
		points[points.length] = 'H' + dot.x;
	}
	else if (wireMode == 'hv'){
		points[points.length] = 'H' + dot.x;
		points[points.length] = 'V' + dot.y;
	}
	else
		alert(wireMode);
	var svg = $("#svg").svg("get");
	var wire = svg.getElementById('wire');
	svg.change( wire, {d: points.join(" ")});
	$.updateCode();
}

// funkcija premakne drugi konec žice za povezavo med elementoma na X, Y
// pozicijo na zaslonu (v $(#svg) elementu)
// funkcijo kliče "mousemove.wire" dogodek.
$.fn.moveEndWire = function(X, Y) {
	var dot = $.snap(X, Y);
	var svg = $('#svg').svg('get');
	var wire = svg.getElementById('wire');
	var points = $(this).attr('d').split(" ");
	var wireMode = $('.selected').attr('id');
	if(wireMode == 'lin'){
		// pri linearnem risanju premikamo eno točko:
		//linearno črto
		points[points.length - 1] = 'L' + dot.x + ',' + dot.y;
	}
	else if (wireMode == 'vh'){
		// pri klasičnem risanju premikamo dve točki:
		//vertikalno in horizontalno črto
		points[points.length - 2] = 'V' + dot.y;
		points[points.length - 1] = 'H' + dot.x;
	}
	else if (wireMode == 'hv'){
		// pri klasičnem risanju premikamo dve točki:
		//horizontalno in vertikalno črto
		points[points.length - 2] = 'H' + dot.x;
		points[points.length - 1] = 'V' + dot.y;
	}
	else
		alert(wireMode);
	svg.change( wire, {d: points.join(" ")});
	$.updateCode();
}

$.fn.movingEndWire = function(){
// zadnjo ali zadnji dve dodani točki aktivne žice #wire premikamo.
	$('#svg').bind('mousemove.wire', function(e){
		e.preventDefault();
		if( $(e.target).attr('id') == "connect" ){ //premikanje po območju spoja ima funkcijo limanja na konec pina.
			var cpos = {'cx':$('#connect').attr('cx').baseVal.value,
						'cy':$('#connect').attr('cy').baseVal.value };
			$('#wire').moveEndWire(cpos.cx, cpos.cy);
		}
		else{
			var off = $('#svg').offset();
			$('#wire').moveEndWire( (e.pageX-off.left), (e.pageY-off.top) );
		}
	});		
}
/*
	Izbranemu tipu povezave iz seznama
	- dodeli (prestavi) class "selected" (= odebeli napis)
	- ustvari ordinato in absciso čez celoten zaslon
	- 
*/
$.fn.drawWire = function() { //RIŠI povezavo
	$('.selected').removeClass('selected');
	$(this).addClass('selected');

	if(!($('#svg').hasClass("wire"))){
		$('#svg').addClass("wire");		//set 'wire' mode
		$.cancelAdd();		//from element mode, clear jobs
	}
	$.setModeWire();
}


$.setModeWire = function(){
	var svg = $("#svg").svg("get");
	var off = $('#svg').offset();
	$.cross();
	$.onPin()
//######################################################################
//Kliki na zaslon dodajajo/ustvarjajo točke.
	$('#svg').bind('click.wire', function(e){ //NARIŠI povezavo
		e.preventDefault();
		if( $(e.target).attr('id') == "connect" ){
			var cir = {	'x':$('#connect').attr('cx').baseVal.value,
						'y':$('#connect').attr('cy').baseVal.value};
			var srcID = $('#connect').attr('class').baseVal;
			if($('#wire').exists() ){
				//MAKE NEW CONNECTION
				if(srcID != $('.active').attr('id')){
					//kliknil na NE aktivni pin
					$.finishWire(srcID);//break
					$('#'+srcID).connectThisPin();
					$('.active').connectThisPin();
					if($('#'+srcID).attr('id')[0] == "w"){
						svg.circle( cir.x, cir.y, 3,
							{'id':"n_"+$('#'+srcID).attr('id'),
							"class":$('#'+srcID).attr('class').baseVal+" node"});
					}
				}
			}
			else{
			//MAKE #wire.
				var path = svg.createPath();
				svg.path(path.move(cir.x, cir.y), {'id': 'wire', 'class':srcID});
				if( $('#'+srcID).hasClassSVG("pin") ){
					$('#'+srcID).setClassSVG("pin active");
				}
				else if( $('#'+srcID).attr('id')[0] == "w" ){
					svg.circle( cir.x, cir.y, 3,
						{'id':"n_"+$('#'+srcID).attr('id'),
						"class":$('#'+srcID).attr('class').baseVal+ " node active"});
					$('#'+srcID).addClassSVG("active");
				}			
				$(this).addNewWirePoint(cir); //Add new point to get line
				$(this).movingEndWire(); //START WIRING: mousemove ON
			}
			
		}
		else{
			var dot = $.snap(e.pageX - off.left,e.pageY - off.top);
			if( $('#wire').exists() ){
				// ob VSAKEM kliku dodamo (vsaj eno) novo točko.
				$(this).addNewWirePoint(dot)
			}
			else{
				//Ne mores kar zacet nekje na sredi
				
			}
		}
	
	});
//######################################################################
// za nedokončana vezja lahko povezavo pustimo odprto z dvoklikom.
	$('#svg').bind('dblclick.wire',function(e){
		e.preventDefault();
		$.finishWire();
console.debug( "Dvojni klik na konec povezave: w" + (wirecount-1) );
	});

}
