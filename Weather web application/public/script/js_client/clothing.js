/*
* Create the "clothing" view, which shows clothing suggestions of a typical weather
* @param event the infomation that passed in. ex: {0: high, 1: low, 2: condition}
* 
*/
function makeClothing(event) {	

	var high = event.data[0];
	var low = event.data[1];
	var condition = event.data[2];

	$('#clothing').css({display: "block"});
	
	$("#clothing").empty();
	makeClothingStructure();

	addClothing(high, low, "M", condition);
	addClothing(high, low, "F", condition);

    selectGender();
	
	// define how to close the page
	$("#close").on('click', function(){
		$("#clothing").css({display: "none"});
	});

}

/*
* Group current temperature into five levels.
* @param {number} temp  the current temperature
* @return {string}      which group current temp belongs to
*/
function tempLevel(temp) {
	switch(true){
		case(temp>25): return "hot";
		case(temp>15): return "regular";
		case(temp>5): return "chill";
		case(temp>-5): return "cold";
		case(temp<=-5): return "freeze";
		default: 
			alert("tempLevel error");
			return null;
	}
}

/*
* Check if current condition is one of special weathers
* return the which special weather currently is or null
*/
function checkCondition(condition) {
	//special_weather is a regular expression
	var special_weather = /(Snow|Rain|Showers|Smoky|Sunny)+/;
	var result = special_weather.exec(condition);
	return (result==null)? null:result[0];
}

// below are some callback/helper functions, names as its functionality

// select a gender to show clothing suggestions
function selectGender() {

	$('#clothingBody .tabDiv li').on('click', function(){
		$('#clothingBody .tabDiv li').removeClass("active");
		$(this).addClass("active");

		//figure out which panel to show
		var panelToShow = $(this).attr('rel');
		$("#clothingBody .cloth-panel.active").slideUp(300, showNextPanel);

		function showNextPanel() {
			$(this).removeClass("active");

			$("#"+ panelToShow).slideDown(300, function() {
				$(this).addClass("active");
			});
		};

	});
}

function makeClothingStructure() {

	$("#clothing").append("<div id=\"clothingContent\"></div>");

	$("#clothingContent")
		.append("<div id=\"clothingHeader\"></div>")
		.append("<div id=\"clothingBody\"></div>");

	$("#clothingHeader")
		.append("<h2>Clothing Suggestion</h2>")
		.append("<span id=\"close\">&times;</span>");

	$("#clothingBody")
		.append("<div class=\"tabDiv\"></div>")
		.append("<div class=\"pannelDiv\"></div>");
	$(".tabDiv").append("<ul class=\"tabs\"></ul>");
	$(".pannelDiv")	
		.append("<div id=\"clothingMen\" class=\"cloth-panel active\"></div>")
		.append("<div id=\"clothingWomen\" class=\"cloth-panel\"></div>");
		
	makeTabs(".tabs");
	makeSubStructure("#clothingMen","For men");
	makeSubStructure("#clothingWomen","For women");


	$(document).mouseup(function(e){
        var _con = $("#clothingContent");
        if(!_con.is(e.target) && _con.has(e.target).length === 0){
            $("#clothing").css({display: "none"});
      }
    });
}

function makeTabs(div) {
	$(div).append("<li rel=\"clothingMen\" class=\"active\"> For Men</li>")
		  .append("<li rel=\"clothingWomen\">For Women</li>");
}

function makeSubStructure(div, title){
	$(div).append("<div class=\"dress\"></div>");
}

//add clothing suggestions in to structure
function addClothing(high, low, gender, condition) {
	var components = ["cloth","pants","shoes"];

	var tempConditionOnHigh = tempLevel(high);
	var tempConditionOnLow = tempLevel(low);
	
	if((tempConditionOnLow==null)||(tempConditionOnHigh==null)) {
		console.log("invalid temperature");
		return;
	}
	//build clothingMen and clothingWomen parts, insert cloting suggestion pictures
	var mainDiv = (gender=="M")? "#clothingMen .dress":"#clothingWomen .dress";

	$(mainDiv)
		.append("<div class=\"temp_high\">When temp high:<br></div>")
		.append("<div class=\"temp_low\">When temp low:<br></div>");
		 
	for(var i=0;i<components.length; i++) {
		var img_path = "img/clothing/"+gender+"_"
			+tempConditionOnHigh+"_"+components[i]+".png";
		$(mainDiv+" .temp_high").append("<img src="+img_path+">");
	}

	for(var i=0;i<components.length; i++) {
		var img_path = "img/clothing/"+gender+"_"
			+tempConditionOnLow+"_"+components[i]+".png";
		$(mainDiv+" .temp_low").append("<img src="+img_path+">");
	}

	//build the Accessories part, determin which picture to show
	var currentCondition = checkCondition(condition);

	if (currentCondition==null) {
		return;
	} else {
		var other_img_path = "img/clothing/"+currentCondition+".png";
		$(mainDiv).append("<div class=\"c_icon\" id=\"other_c\">Accessories:</div>");
		$(mainDiv+" #other_c").append("<img src="+other_img_path+">");
	}

}

