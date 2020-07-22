//make about page
function makeAbout(){
	buildAboutStructure();
	addAboutClickFunction();
	addAboutContent();
}

function buildAboutStructure(){
	$("#about").append("<div id=\"aboutContent\"></div>");

	$("#aboutContent")
		.append("<div id=\"aboutHeader\"></div>")
		.append("<div id=\"aboutBody\"></div>");

	$("#aboutHeader")
		.append("<h2>About Us</h2>")
		.append("<span class=\"close\">&times;</span>");

	$("#aboutBody")
		.append("<marquee behavior=\"scroll\" scrollamount=\"5\" direction=\"up\"></marquee>");
	
	$("#aboutBody marquee")
	.append("<div id=\"aboutus\"></div>");
}

function addAboutClickFunction(){
	$("#about").click(hideAbout);
	$("#about .close").click(hideAbout);
}

function hideAbout(){
	$("#about").css({display: "none"});
}

function addAboutContent(){
	$("#aboutus")
	.append("<h3>Source</h3>")
	.append("<p>Icons from <a href=\"http://erikflowers.github.io/weather-icons/\">Weather Icons</a></p>")
	.append("<p>Weather date comes from <a href=\"https://developer.yahoo.com/weather/\">Yahoo weather</a>.</p>")
	.append("<p>Auto city name complete function comes from <a href=\"https://developers.google.com/maps/documentation"
		+"/javascript/places-autocomplete\">Google City Autocomplete</p>")
	.append("<h3>Authors</h3>")
	.append("<p id=\"author\"></p>");

	//autors' information
	addAuthor("Enhao Wu (Lionel)","lionel.wu@mail.utoronto.ca");
	addAuthor("Hao Wang","haowang.wang@mail.utoronto.ca");
	addAuthor("Quan Zhou (Catherine)","catherine.zhou@mail.utoronto.ca");
	addAuthor("Yian Wu (Stella)","yian.wu@utoronto.ca");
}

function addAuthor(name,email){
	$(`<div class="personal_info">
		<span class="name">Name: `+ name +`</span><br>
		<span class="email">Email: `+ email +`</span><br>	
	<div><br>`).appendTo("#author");
}

//click function of "about", show about
function showAbout(){
	$("#about").empty();
	makeAbout();
	$("#about").css({display:"block"});
}
