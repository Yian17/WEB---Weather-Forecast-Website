const origin = window.location.origin;
let isLogin = false;
//indicator of position in prediction, reset when input updates
var positionIndex=0;

//make search page
function makeSearch(){
	makeSearchStructure();
	makeSearchBody(makeSearchBodyDetail);
	deterShowUserInfo();
}

function makeSearchStructure(){
	$("#userLogEntry").append(`<button onclick="showLogIn()" id="loginLink">LogIn</button>`);
	
	$("#topnavContent").append("<a href=\"#searchPage\">Search</a>")
				  	   .append("<a onclick=\"showAbout()\">About</a>");

	$("#searchPage").append("<h1>Weather Search</h1>")
					.append("<div id=\"searchBody\"></div>")
					.append(`<div id="userView"></div>`);
}

function makeSearchBody(buildDetail){
	$("#searchBody").append("<input type=\"text\" id=\"searchTextField\" "
								+ "autocomplete=\"off\" data-country=\"\" "
								+"placeholder=\"City Name...\">")
					.append("<span id=\"searchButtonBg\"></span>");

	//when click searchTextField then select everything
	$("#searchTextField").click(function(){
		$("#searchTextField").select();
	});

	buildDetail();
}

function makeSearchBodyDetail(){
	$("#searchButtonBg").append(`<button id="searchButton" 
		onclick="searchAction()">Search</button>`);
}

//infomation in the won't change, unless user gives a valid input
function searchAction(){
	//user selected prediction
	var currentSelected = $(".city-autocomplete div")[positionIndex];
	var autoText = $(currentSelected).text();

	//set user selection to text filed
	$("#searchTextField").val(autoText);

	if(isLogin) saveCity(autoText);

	searchCity(autoText);
}

//split original search action to two function
function searchCity(city){
	var searchInput = city;
	var url = origin + "/api/weather/" + searchInput;

	//avoid user search nothing
	if(searchInput.length == 0){
		alert("Nothing to search");
		return;
	}
	
	$.ajax({
		type: "GET",
		url: url,
		success: function(data){
			var results = data.query.results
			
			//case that fail to find a city's weather information
			if(results == null){
				alert("No weather information of this city");
				$("#searchTextField").val("");
				return;
			}

			results = data.query.results.channel;
			//after each search re-set all related view
			resetView();
			//buile following two parts for each search
			makeToday("#today",results);
			makeForcast("#forecast",results);
			
			//show user all information after first search
			activateSearchResult();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
	        alert("abnormal network connection"); 
	    } 
	});
}

function resetView(){
	$("#topnavContent").empty();
	$("#searchResult").empty();

	$("#topnavContent").append("<a href=\"#searchPage\">Search</a>")
				  .append("<a href=\"#today\">Today</a>")
				  .append("<a href=\"#forecast\">Forecast</a>")
				  .append("<a onclick=\"showAbout()\">About</a>")
				  
	$("#searchResult").append("<div id=\"today\"></div>")
					  .append("<div id=\"forecast\"></div>")
					  .append("<div id=\"clothing\"></div>");
}

function fetchSelectedPrediction(){
	//reset index
	positionIndex = 0;
	
	var prevSelected = $(".city-autocomplete div")[positionIndex];
	$(prevSelected).addClass('selected');
}

function activateSearchResult(){
	$("#searchResult").show();
	window.location.replace("weather#today");
	shiftWindow();
}

//leave space for topnav for every page
function shiftWindow(){
	scrollBy(0,-0.09*0.25*$(document).height());
};

//show topnav background color after a 
//specific height(21% from the top of the html)
function addTopnavEffect(){
	(function($) {          
	    $(document).ready(function(){                   
	        $(window).scroll(function(){                          
	            if ($(this).scrollTop() > $(document).height()*0.21) {
	            	$("#topnavBg").css({"background-color": "#333"});
	                $('#topnavBg').fadeIn(500);
	            } else {
	            	$("#topnavBg").css({"background-color": "transparent"});
	                $('#topnavBg').fadeOut(500);
	            }
	        });
	    });
	})(jQuery);
}

//allowed user use enter key instead of click Search button
function addEntreKeyEvent(buttonID){
	var enter_keyCode = 13;
	$("#searchTextField").keyup(function(event){
	    if(event.keyCode == enter_keyCode){
	    	$('.city-autocomplete').hide();
	       	$(buttonID).click();
	    }
	});
}

//allowed user use up and down arrow to switch predictions
function setUpAndDownKey(){
	var upArror_keyCode = 38;
	var downArror_keyCode = 40;

	$(document).keydown(function(event){
		//remove background color of previous prediction
		var prevSelected = $(".city-autocomplete div")[positionIndex];
		$(prevSelected).removeClass('selected');

		if(event.keyCode == upArror_keyCode){
			if(positionIndex>0) positionIndex--;
		}else if(event.keyCode == downArror_keyCode){
			var l = $(".city-autocomplete div").length;
			if(positionIndex<l-1) positionIndex++;
		}

		//make selected prediction in different background color
		var nextSelected = $(".city-autocomplete div")[positionIndex];
		$(nextSelected).addClass("selected");
	})
}

//block default up and down arrow action
var DisableArrowKeys = function(e){
	var ar = new Array(38, 40);
    if ($.inArray(e.which, ar) > -1) {
        e.preventDefault();
        return false; 
    }
    return true;
}

//if user logged in, show more functional view to user
function deterShowUserInfo(){
	var dataURL = origin+"/api/users/data";
	$.ajax({
		type: "GET",
		url: dataURL,
		success: function(data){
			$("#userLogEntry").empty();
			$("#userLogEntry").append(`<a onClick="showLogIn()" id="loginLink">LogIn</a>`);

			$("#userView").empty();
			$("#message").hide();
			$("#profile-settings").hide();
			
			if(data!==false){
				makeUserView(data);
				makeProfileSettings(data);
				check_session_expired();
				isLogin = true;
			}else{
				try {
					isLogin = false;
				    ReactDOM.unmountComponentAtNode(document.getElementById('message'));
				} catch (e) {}
			}
		}
	});
}

function makeUserView(user){
	$("#userLogEntry").empty();
	$("#message").show();
	
	$("#userLogEntry").append(`<span onClick="showProfileSettings()">Hi,`+user.username+`<span>`)
					  .append(`<span onClick="logoutAction()">SignOut</span>`);

	$("#userView").empty();
	$("#userView").append(`<div id="cityTags"></div>`);

	var cities = user.savedCities;
	ReactDOM.render(React.createElement(CitiesTag, { cities: cities }), document.getElementById('cityTags'));
	ReactDOM.render(React.createElement(Messages, null), document.getElementById('message'));

	$("#saveCity").prop('checked', false);
}

//save user's searched city
function saveCity(city){
	var addPreferenceURL=origin+"/api/users/addCity";
	var addedCity = {
		city: city
	};

	$.ajax({
		type: "PUT",
		contentType: 'application/json',
	    dataType: 'json',
		url: addPreferenceURL,
		data: JSON.stringify(addedCity),
		success: function(data){
			if(data===false){
				alert("unable to save this city");
			}else{
				deterShowUserInfo();
			}
		},
		error: function(){
			alert("network error: unable to save city");
		}
	});
}

//checking if user's session expired every 3 seconds
function check_session_expired(){
	var url = origin + "/api/users/session_expired";

	$.ajax({
		type:"GET",
	    url: url,
	    success: function(data){
	    	setTimeout(function(){
	    		if(!data){
		    		alert("session_expired");
		    		deterShowUserInfo();
		    	}else{
		    		check_session_expired();
		    	}
	    	},5 * 1000);
	    },
	    error: function(){
	    	alert("abnormal network error");
	    },
	})
}

function logoutAction(){
	window.location.replace("/users/logout");
}

/*--------------main--------------*/
makeSearch();
addTopnavEffect();

$("#searchResult").hide();
$('#searchTextField').cityAutocomplete();
$(document).bind("keydown", DisableArrowKeys);

setUpAndDownKey();
addEntreKeyEvent("#searchButton");

if(location.hash) shiftWindow();       
window.addEventListener("hashchange",shiftWindow);
