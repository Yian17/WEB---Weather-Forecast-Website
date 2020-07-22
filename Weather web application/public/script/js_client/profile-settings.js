function showProfileSettings() {
	$("#profile-settings").show();
}

function makeProfileSettings(user) {
	$("#profile-settings").empty();

	$("#profile-settings").append(`<div id="SettingContent"></div>`);

	$("#SettingContent")
		.append(`<div id="SettingHeader"></div>`)
		.append(`<div id="SettingBody"></div>`);

	$("#SettingHeader")
		.append(`<div id="account-info">Account Information</div>`)
		.append(`<span class="close">&times;</span>`);

	makeSettingBody(user);

	addSettingClossClickFunction();
	addPageCloseClickFunction();
	
}

function makeSettingBody(user) {

	ReactDOM.render(React.createElement(ProfileSettings, {user:user}), document.getElementById('SettingBody'));

}

// add click action to close this page
function addSettingClossClickFunction() {
	$("#SettingHeader .close").click(hidePage);
}

function addPageCloseClickFunction() {
	$("#profile-settings").click(hidePage);

	$('#SettingContent').click(function(event){
    event.stopPropagation();
	});
}

function hidePage(){
	$("#profile-settings").css({display: "none"});
}


