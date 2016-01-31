/* ########## upravljanje z dogodki ########## */
// funkcija onemogoči vse dogodke in pusti le dogodke za povezovanje
$.cancelAdd = function() {
	$('#svg').removeClass('element').unbind('mousemove.element');
	if($('#mouse').exists()) $("#svg").svg("get").remove($('#mouse'));
}






/* ########## upravljanje z risanjem ########## */
// funkcija premakne svg element na X, Y pozicijo na zaslonu (v $(#svg) elementu)
$.fn.moveSVG = function(X, Y){
	var off = $('#svg').offset();
	var snap = $.snap((X - off.left), (Y - off.top))
	var svg = $('#svg').svg('get');
	var element = svg.getElementById($(this).attr('id'));
	svg.change( element, {x: snap.x, y: snap.y});
}

/*	Izbranemu elementu iz seznama
	- dodeli (prestavi) class "selected" (= odebeli napis)
	- v oknu za predogled prikaže simbol izbranega elementa */	
$.fn.setAddMode = function(e) {
	if(!($('#svg').hasClass("element"))){
		$('#svg').addClass("element")
		$.cancelWire();
	}
	$(".selected").removeClass("selected");
	$(this).addClass("selected");
	// JE MOGOČE SPODAJ KAJ OPTIMIZIRAT? LAHKO DIREKTNO DOSTOPAM DO ELEMENTA V BAZI?
	$.ajax({
		type: "GET",
		url: "library/library.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('element').each(function(){	if( $(this).attr('id') == $('.selected').attr('id') ){
				var symbol = $(this).children('symbol').text();
				var pins = $(this).children('pin');
				var svg = $("#svg").svg("get");
				var svgoff = $('#svg').offset();
				var liboff = $("#libpreview").offset();
				/* pri novo izbranem elementu, se prej označeni $(#mouse) uniči in ustvari nov z istim IDjem $(#mouse)*/
				if( $('#mouse').exists() )
					svg.remove( $('#mouse') );
				var mouse = svg.use('library/symbols.svg#'+symbol, { //element postavimo točno pod predogled
					'x': liboff.left - svgoff.left + 61 ,
					'y': liboff.top - svgoff.top + 61 ,
					'id': 'mouse'
				});
				var thum = 	$("#libpreview").svg("get");
				thum.clear();
				thum.use(60, 60, 100, 100, "library/symbols.svg#" + symbol);
				$('#mouse').click( function(){ $(this).addNewElement(e, pins) });
				$('#svg').bind('mousemove.element',function(e){
					e.preventDefault();
					$('#mouse').moveSVG(e.pageX, e.pageY);
					$.updateCode(); //za kontrolo prikažemo SVG kodo.
				});
			
				return false;
			} });//	Knjižnjica elementov za risanje je naložena in seznam zgrajen.
		}	
	});
}

$.fn.addNewElement = function(e, pins) {
	e.preventDefault();
	var svg = $('#svg').svg('get');
	var off = $('#svg').offset();
	var cloned = svg.clone( $('#mouse') ); //na mestu, kjer je $(#mouse), se ustvari njegova kopija
	$(cloned).attr('id', 'e'+elcount); //kopiji priredimo ustrezen ID
	var pos = {	'x':$('#mouse').attr('x').baseVal.value,
				'y':$('#mouse').attr('y').baseVal.value };
	pins.each(function(i){
		//<circle id="'e'+elcount_+" cx="0" cy="0" r="5" class="connection" style=""/>
		var pin = svg.circle(
			(pos.x + $(this).attr('x')*1),
			(pos.y + $(this).attr('y')*1), 5,
			{	'id': 'e'+elcount+'-'+$(this).attr('id'),
				'class':"pin open"});
	});
	$('#svg_code').text( svg.toSVG() ); //za kontrolo prikažemo SVG kodo.
	elcount++; //pripravimo ID za naslednji element
	$(cloned).dblclick(function(e){
		e.preventDefault();
console.debug( $(this).attr('x').baseVal.value );
		$("<div/>", {id:"settings"})
			.css({'position':'absolute',
				'top':($(this).attr('y').baseVal.value*1 + off.top),
				'left':($(this).attr('x').baseVal.value*1 + off.left) })
			.text('dvojni klik na'+e.target.id)
			.appendTo('body');
		});

	$(cloned).click(function(e){
//console.debug( $(".chosen").attr('id') );
		$(".chosen").removeClass("chosen");
		var svg = $("#svg").svg("get");
		var chosen = svg.getElementById(e.target.id);
		svg.change(chosen, {'class': "chosen"});
//		$('#'+e.target.id).addClass("chosen");

//console.debug( $(".chosen").attr('id') );
//console.debug( chosen );
//console.debug( e.target.id );
	});
//console.debug( $(this).attr('class').baseVal );
}
