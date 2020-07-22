//make forecast page
function makeForcast(forecast,data) {

    data = data.item.forecast;

    buildForcastStructure(forecast);
    buildContentInfo(data,7); 
}

function buildForcastStructure(forecast) {

	$(forecast)
    .append("<div id=\"forecastTop\"></div>")
    .append("<div id=\"forecastContent\"></div>");

    $("#forecastTop")
    .append("<h2 id=\"forecastTitle\">7 Days Forecast</h2>");
}

function buildContentInfo(data,numbDay) {

	if(numbDay>data.length){ 
		alert("cannot forecast coming"
			+numbDay+"days' weather");
		return;
	}

    //recursively add forecasts to forecastContent
	for(var i=0; i<numbDay; i++){
        $("#forecastContent").append("<div class=\"singleDay\" id=\""+"c"+i+"\"></div>")
                             .append("<div class=\"panel\" src=\"script/clothing.js\"><div>");

        var date = data[i].date.substring(0,6);
    	var day = data[i].day;
    	var high = data[i].high;
    	var low = data[i].low;
        var condition = data[i].text;
        var condition_code = data[i].code;

        high = convertTemp(parseInt(high));
        low = convertTemp(parseInt(low));
        var icon_class = "wi wi-yahoo-"+condition_code;
        
        var maindiv = "#c"+i;
        $(maindiv).css({
            "top": 13*i+"%"
        });

        $(maindiv)
        .append("<div class=\"date\">"+ date +"-"+ day +"</div>")
        .append("<div class=\"forecastIcon\"></div>")
        .append("<div class=\"forecastTemp\">"+high+" - "+low+"°C</div>")
        .append("<button class=\"toCloth\"><span>Clothing</span></button>");
        
        // by click "clothing" button, "clothing" view will be generated
        $(maindiv+" button").click({0: high, 1: low, 2: condition}, makeClothing);
        
        $(maindiv+" .forecastIcon")
        .append("<i class=\""+icon_class+"\"></i>")
        .append("<span class=\"popuptext\">"+condition+"</span>");
        
        //add pop up text box action
        $(maindiv+" .forecastIcon i")
        .mouseenter({div:maindiv},popAppear)
        .mouseleave({div:maindiv},popDisappear);
    }
}

// function popAppear and popDisappear are in charge of control tooltip on forecastIcon
function popAppear(event) {

    var div = event.data["div"];
    $(div+" .forecastIcon .popuptext").fadeIn();
}

function popDisappear(event) {
    
    var div = event.data["div"];
    $(div+" .forecastIcon .popuptext").fadeOut();
}



