//make LogIn page
function makeLogIn(){
	buildLogInStructure();
	addLogInClickFunction();
	addLogInContent();
	LoginClose()
}

function buildLogInStructure(){
	document.scripts[0].src="script/js_client/register.js"

	$("#LogIn").append("<div id=\"LogInContent\"></div>");

	$("#LogInContent")
		.append("<div id=\"LogInHeader\"></div>")
		.append("<div id=\"LogInBody\"></div>");

	$("#LogInHeader")
		.append("<h2>Log in</h2>")
		.append("<span class=\"close\">&times;</span>");

    $("#LogInBody")
        .append("<div id=\"inputLines\"></div>");
}

function addLogInClickFunction(){
	$("#LogIn .close").click(hideLogIn);
}

function hideLogIn(){
	//$("#LogIn").css({display: "none"});
	$("#LogIn").hide();
}

function addLogInContent(){
	ReactDOM.render(React.createElement(UserLogIn, null), document.getElementById('inputLines'));
}

function LoginClose(){
	$(document).mouseup(function(e){
        var _con = $("#LogInContent");
        if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            hideLogIn();
      }
    });
}

function JumpRegister() {
	hideLogIn();
	showRegister();
}

//click function of "LogIn", show LogIn
function showLogIn(){
	$("#LogIn").empty();
	makeLogIn();
	$("#LogIn").show();
	//$("#LogIn").css({display:"block"});
}
