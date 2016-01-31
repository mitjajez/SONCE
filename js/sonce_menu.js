$.fn.buildMenu = function(){
	var val="";
	var ico="";
	var cut="";
		$.ajax({
		type: "GET",
		url: "xml/menu.xml",
		dataType: "xml",
		success: function(xml) {
			$("<ul/>", {id:"nav"}).addClass('dropdown').addClass('dropdown-horizontal').appendTo('#panel');
			$(xml).find('main_menu').children('item').each(function(i){
/* Orodna vrstica */
				var topid = $(this).children('id').text();
//				var topval = $(this).children('value').text();
//				$("<li/>", { id: topid }).text( topval ).appendTo('#nav');
				val = $(this).children('value').text();
				ico = $(this).children('icon').text();
//				cut = $(this).children('shortcut').text();
				$("<li/>", { id: topid }).text( val ).appendTo('#nav');
/* Meniji - nivo 1*/
				var menu1 = $(this).children('menu');
				if(menu1.length>0){
					$("<ul/>", { id: 'ul_'+topid }).appendTo('#'+topid);
					menu1.children('item').each(function(j){
						$('#'+topid).addClass('dir');
						var id1 = $(this).children('id').text();
//						var val1 = $(this).children('value').text();
//						$("<li/>", { id: id1 }).text( val1 ).appendTo( '#ul_'+topid );
						val = $(this).children('value').text();
						ico = $(this).children('icon').text();
						cut = $(this).children('shortcut').text();
						$("<li/>", { id: id1 }).text( val ).appendTo( '#ul_'+topid );
						$("<span/>").addClass('shortcut').text( cut ).appendTo( '#'+id1 );
/* Meniji - nivo 2*/
						var menu2 = $(this).children('menu');
						if(menu2.length>0){
							$('#'+id1).addClass('dir');
							$("<ul/>", { id: 'ul_'+id1 }).appendTo('#'+id1);
							menu2.children('item').each(function(k){
								var id2 = $(this).children('id').text();
//								var val2 = $(this).children('value').text();
//								$("<li/>", { id: id2 }).text( val2 ).appendTo( '#ul_'+id1 );							
								val = $(this).children('value').text();
								ico = $(this).children('icon').text();
								cut = $(this).children('shortcut').text();
								$("<li/>", { id: id2 }).text( val ).appendTo( '#ul_'+id1 );							
/* Meniji - nivo 3*/												
								var menu3 = $(this).children('menu');
								if(menu3.length>0){
									$('#'+id2).addClass('dir');
									$("<ul/>", { id: 'ul_'+id2 }).appendTo('#'+id2);
									menu2.children('item').each(function(k){
										var id3 = $(this).children('id').text();
//										var val3 = $(this).children('value').text();
//										$("<li/>", { id: id3 }).text( val3 ).appendTo( '#ul_'+id2 );
										val = $(this).children('value').text();
										ico = $(this).children('icon').text();
										cut = $(this).children('shortcut').text();
										$("<li/>", { id: id3 }).text( val ).appendTo( '#ul_'+id2 );
									});						
								}
							});
						}
					});
				}
			});
			$('li').filter(':last').addClass('last');
		}	
	});

}
