// Simple helper function creates a new element from a name, so you don't have to add the brackets etc.
$.createElementXML = function(name)
{
    return $('<'+name+' />');
};

// JQ plugin appends a new element created from 'name' to each matched element.
$.fn.appendNewElementXML = function(name)
{
    this.each(function(i)
    {
        $(this).append('<'+name+' />');
    });
    return this;
}

//############################################
$.addNode = function(w){
	console.debug( "-- Add Node:" );
	console.debug( $('#'+w).attr('class').baseVal );
	var pins = $('#'+w).attr('class').baseVal.split(' ');
	var nodes = $XMLroot.find('nodes');
	nodes.append(
		$('<node />').attr('id', nodecount).append(
			$('<element />').attr('id', pins[0])
		).append(
			$('<element />').attr('id', pins[1])
		)
	)
	$('#'+w).setClassSVG(nodecount++);
}
$.removeNode = function(w){
	console.debug( "Remove Node:" );
	var nodes = $XMLroot.find('nodes');
	var node = $('<node />').attr('id', nodecount).appendTo(nodes);
	$('#'+w).setClassSVG(nodecount++);
	console.debug( node );
	console.debug( $('#'+w) );
}
$.addElementToNode = function(w){
}
