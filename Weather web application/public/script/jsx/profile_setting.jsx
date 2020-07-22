class ProfileSettings extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			email: '',
			checkPassword: ''
		};

		this.handelSubmit = this.handelSubmit.bind(this);
		this.handleSexOnChange = this.handleSexOnChange.bind(this);
		this.emailOnChange = this.emailOnChange.bind(this);
		this.passwordOnChange = this.passwordOnChange.bind(this);
		this.checkPasswordOnChange = this.checkPasswordOnChange.bind(this);

	}

	handelSubmit(e){
		e.preventDefault();

		var newUserdata = this.state;
		var url = window.location.origin + "/api/users/updateUserInfo";

		var newUserdata = this.state;
		delete newUserdata.checkPassowrd; 

		$.ajax({
	        type:"PUT",
	        contentType: 'application/json',
	        dataType: 'json',
	        url:url,
	        data: JSON.stringify(newUserdata),
	        success: function (data) {
	        	if(data!==false){
	        		deterShowUserInfo();
	        	}else{
	        		alert("Oooops, can not edit your profile.");
	        	}
	        },error:function(){
	        	console.log("error");
	        }
	      });
	}

	passwordOnChange(e){
		var password = e.target.value;
		
		if(password!=''){
			this.setState({password: password});
		}

		if(password!=this.state.checkPassword){
			checked_password.innerHTML=" Confirm Password must be the same with New Password!";
			$("#save-changes").prop('disabled', true);
		} else {
			checked_password.innerHTML="";
		}

	}

	checkPasswordOnChange(e){
		var confirmPassword = e.target.value;
		this.setState({checkPassowrd: e.target.value});

		$("#save-changes").prop('disabled', true);

		if(this.state.password!=confirmPassword){
			checked_password.innerHTML=" Confirm Password must be the same with New Password!";
			$("#save-changes").prop('disabled', true);
		} else {
			checked_password.innerHTML="";
			$("#save-changes").prop('disabled', false);
		}
	}

	emailOnChange(e){
		var email = e.target.value;
		this.setState({email:email});

		if(email == ""){
			//allow user remove their email
			setting_email.innerHTML="";
 			$("#save-changes").prop('disabled', false);
		} else if(!(email.indexOf('@') > -1)) {
 			setting_email.innerHTML=" Email should be in the form of XXX@XXX.XX";
 			$("#save-changes").prop('disabled', true);
 		} else if(!(email.indexOf('.') > -1)) {
 			setting_email.innerHTML=" Email address should contain \".\"";
 			$("#save-changes").prop('disabled', true);
 		} else {
 		    setting_email.innerHTML="";
 			$("#save-changes").prop('disabled', false);
 		}
 		
	}

	handleSexOnChange(e){
		var gender = e.target.value;
		this.setState({gender: gender});

		if((gender=="M")||(gender=="F")||(gender=="")){
			check_gender.innerHTML="";
			$("#save-changes").prop('disabled', false);
		}else{
			check_gender.innerHTML="Invalid gender(M/F)";
			$("#save-changes").prop('disabled', true);
		}
	}

	componentDidMount(){
		$("#save-changes").prop('disabled', true);
		this.setState(this.props.user);
	}

	render(){
		return(

		<form id="settingArea" onSubmit={this.handelSubmit}>

			<h4>
				User Name: {this.state.username}
			</h4>
			<h4>
				Email: <span> </span>
				<input type="text" id="emailInput" onChange={this.emailOnChange} value={this.state.email==null? "" : this.state.email}/>           
				<span id="setting_email"></span>
			</h4>
			<h4>
				Gender:
				<input type="text" id="genderTextField" onChange={this.handleSexOnChange} value={this.state.gender==null? "" : this.state.gender}/>
				<span id="check_gender"></span>
			</h4>
			<h4>
				Account created on:  {this.state.createDate}
			</h4>
			<h4>
				Visted:  {this.state.visitCount} times
			</h4>
			<h4>
				New Password:  
				<input type="password" id="passwordInput" onChange={this.passwordOnChange}/>
			</h4>
			<h4>
				Confirm Password:  
				<input type="password" id="c-passwordInput" onChange={this.checkPasswordOnChange}/>
				<span id="checked_password"></span>
			</h4>

			<button id="save-changes">Save</button>

		</form>

		)
	}
}
