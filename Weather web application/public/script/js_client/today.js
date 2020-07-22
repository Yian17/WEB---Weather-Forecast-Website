
/*
* Create the "today" view, which shows today's weather details
* @param {string} today  tells you where the script works on
* @param {object} data   the search result
*/
function makeToday(today,data) {

    buildTodayStructure(today, data);

}

/*
* Returns the actual value displayed on the webpage according to the given item.
* @param key the key of given item. ex. given item1 {high:12} , then key is high 
* @return val the value of given item. ex. given item1 {high:12} , then val is 12
*/ 

function makeShowValue(key, val){
    switch(key) {
        case "high": return convertTemp(val)+" °C";
        case "low": return convertTemp(val)+" °C";
        case "condition": return ""+val+"";
        case "sunrise": return ""+val+""+" AM";
        case "sunset": return ""+val+""+" PM";
        case "chill": return convertTemp(val)+" °C";
        case "direction": return getWindDirection(val);
        case "speed": return ""+val+" Km/h";
        case "humidity": return ""+val+" %";
        case "pressure": return ""+val+" millbars";
        case "rising": return ""+val+" ";
        case "visibility": return ""+val+" Km";
    }
}

/*
* Convert temperature from farenheit to ceilcius
*/
function convertTemp(farenheit) {
    return Math.round((farenheit - 32)*5/9);
}

/*
* Return the wind direction according the given integer
* @param {integer} integerDirection  an integer represent the wind direction 
* @return {String} wind direction, EX. 205 -> SSW
*/
function getWindDirection(integerDirection) {
    var lookupValue = Math.round(integerDirection/22.5);
    switch(lookupValue) {
        case 1: return "N";
        case 2: return "NNE";
        case 3: return "NE";
        case 4: return "ENE";
        case 5: return "E";
        case 6: return "ESE";
        case 7: return "SE";
        case 8: return "SSE";
        case 9: return "S";
        case 10: return "SSW";
        case 11: return "SW";
        case 12: return "WSW";
        case 13: return "W";
        case 14: return "WNW";
        case 15: return "NW";
        case 16: return "NNW";
        case 17: return "N";
    }
}

// Below are some callback functions, named as its functionality 
function buildTodayStructure(today, data) {
    $(today).append("<div class=\"upperDiv\"></div>");
    $(today).append("<div class=\"lowerDiv\"></div>");

    buildUpperDivSubStructure(".upperDiv", data);
    buildLowerDivSubStructure(".lowerDiv", data);
}

function buildUpperDivSubStructure(upperDiv, data) {
    var currentTemp = convertTemp(data.item.condition.temp);
    
    $(upperDiv).append("<div class=\"currentWeather\"></div>");
    $(".currentWeather").append("<div class=\"temp_img_feelslike\"></div>")
                        .append("<div class=\"location_time\"></div>");

    // deal with upper-left part: temp_img_feelslike
    var iconID = "wi wi-yahoo-" + data.item.condition.code;
    $(".temp_img_feelslike").append("<div id=\"currentTemp\">"+currentTemp+"</div>")
                            .append("<div id=\"celcius_feels_like\"></div>")
                            .append("<i id=\"temp_img\" class=\""+iconID+"\"></i>");

    buildUpperLeftMiddleSubstructure("#celcius_feels_like", data);

    // deal with upper-right part: location_time
    $(".location_time").append("<div class=\"current-weather_location\">location</div>")
                       .append("<div>"+data.item.condition.date+"</div>");

    buildUpperRightLocationSubstructure(".current-weather_location", data);
}

function buildUpperLeftMiddleSubstructure(celciusFeelsLike, data) {
    var currentTempText = data.item.condition.text;
    var feelsLikeValue = convertTemp(data.wind.chill);

    $(celciusFeelsLike).append("<div id=\"celcius\">°C</div>")
                         .append("<div id=\"feels_like\"></div>")
                         .append("<div id=\"temp_text\">"+currentTempText+"</div>");
    buildFeelsLikeDiv("#feels_like", feelsLikeValue);

    var hell = document.getElementById("temp_text");
}

function buildFeelsLikeDiv(feelsLike, feelsLikeValue) {
    $(feelsLike).append("<span id=\"feels-like_label\">Feels Like</span>")
                .append("<span id=\"feels-like_value\">"+feelsLikeValue+"</span>");
}

function buildUpperRightLocationSubstructure(location, data) {
    $(location).html("<span id=\"location\"> "+data.location.city+" </span> "
        +data.location.region+" "+data.location.country+"");
}

function buildLowerDivSubStructure(lowerDiv, data) {
    $(lowerDiv).append("<div class=\"lower-left\"></div>");

    buildLowerLists(".lower-left", data);
}

function buildLowerLists(lowerLeft, data) {
    buildLowerList(lowerLeft, "left");
    buildLowerList(lowerLeft, "middle");
    buildLowerList(lowerLeft, "right");

    $("#left").append("<div class=\"detail_header\"><span>Today</span></div>")
            .append("<ul class=\"lower_div_list\" id=\"whole-day\"></ul>");
    
    $("#middle").append("<div class=\"detail_header\ id=\"windHeader\"><span>Wind</span></div>")
            .append("<ul class=\"lower_div_list\" id=\"wind\"></ul>")
            .append("<div class=\"windMill\"></div>");

    $("#right").append("<div class=\"detail_header\" ><span>Atmosphere</span></div>")
              .append("<ul class=\"lower_div_list\" id=\"atmosphere\"></ul>");


    $(".windMill").append("<img id=\"windmill-blade\" src=\"img/today/windmill_blade_big.png\">")
                  .append("<div id=\"windmill-pole-div\"><div>");

    $("#wind").slideUp(600).delay(400).slideDown(1500);
    
    var wind = data.wind;
    var atmosphere = data.atmosphere;
    var wholeDay = {
        high : data.item.forecast[0].high,
        low: data.item.forecast[0].low,
        condition: data.item.forecast[0].text,
        sunrise: data.astronomy.sunrise,
        sunset: data.astronomy.sunset
    } 

    var lowerLeftGroups = [wholeDay, wind, atmosphere];
    fillInLowerLeftData(lowerLeftGroups);
    $("#0").hide();
   
}

function buildLowerList(lowerLeft, header) {
    $(lowerLeft).append("<div class=\"lower_left_part\" id=\""+header+"\"></div>");
}

function fillInLowerLeftData(lowerLeftGroups) {
    var listId = 0;

    lowerLeftGroups.forEach(
        function(element) {
            Object.getOwnPropertyNames(element).forEach(
                function(key, idx, array) {
                    var val = element[key];
                    var showValue = makeShowValue(key, val);
                    listId ++;

                    var sectionName = ""; 
                    
                    if(element["high"]) {
                        sectionName = "whole-day";
                    }else if (element["chill"]) {
                        sectionName = "wind";
                    }else {
                        sectionName = "atmosphere";
                    }

                    $("#"+sectionName).append("<li class=\"list_item\" id=\""+listId+"\"></li>");
                    $("#"+listId).append("<div class=\"list_item_left\">"+key+"</div>")
                                 .append("<div class=\"list_item_right\">"+showValue+"</div>");
                }
            ) 
        }
    )
    
}
