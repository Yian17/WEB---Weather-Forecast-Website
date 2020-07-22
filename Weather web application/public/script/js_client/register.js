//make Register page
function makeRegister(){
	buildRegisterStructure();
	addRegisterClickFunction();
	addRegisterContent();

	
	PageClose();
}

function buildRegisterStructure(){
	$("#Register").append("<div id=\"RegisterContent\"></div>");

	$("#RegisterContent")
		.append("<div id=\"RegisterHeader\"></div>")
		.append("<div id=\"RegisterBody\"></div>");

	$("#RegisterHeader")
		.append("<h2>Register</h2>")
		.append("<span class=\"close\">&times;</span>");

	$("#RegisterBody")
	    .append("<div id=\"RegInputContent\"></div>")
}

function addRegisterClickFunction(){
	$("#Register .close").click(hideRegister);
}

function hideRegister(){
	$("#Register").css({display: "none"});
}

function addRegisterContent(){
	ReactDOM.render(React.createElement(RegisteNew, null), document.getElementById('RegInputContent'));
}

function PageClose(){
	$(document).mouseup(function(e){
        var _con = $("#RegisterContent");
        if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            hideRegister();
      }
    });
}

function JumpToLog() {
	hideRegister();
	showLogIn();
}


//click function of "Register", show Register
function showRegister(){
	$("#Register").empty();
	makeRegister();
	$("#Register").css({display:"block"});
}
