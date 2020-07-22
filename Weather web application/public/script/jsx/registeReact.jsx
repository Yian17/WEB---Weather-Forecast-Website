class RegisteNew extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: '',
			checkPassowrd: ''
		};

		this.handelSubmit = this.handelSubmit.bind(this);
		this.usernameOnChange = this.usernameOnChange.bind(this);
		this.emailOnChange = this.emailOnChange.bind(this);
		this.passwordOnChange = this.passwordOnChange.bind(this);
		this.checkPasswordOnChange = this.checkPasswordOnChange.bind(this);
		this.sexOnChange = this.sexOnChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handelSubmit(e){
		e.preventDefault();

		if((this.state.password=='')||(this.state.username=='')){
			err_message.innerHTML = "have to have a username and a password";
			return;
		}

		var newUserdata = this.state;
		delete newUserdata.checkPassowrd; 

		var url = window.location.origin + "/api/users";
		$.ajax({
	        type:"POST",
	        contentType: 'application/json',
	        dataType: 'json',
	        url:url,
	        data: JSON.stringify(newUserdata),
	        success: function (data) {
	        	if(data!==false){

	        		$("#err_jump_message").text("Jump to Log in page in");
	        		$("#seconds").text("3");
	        		var wait = $("#seconds").text();
	        		timeOut();
	        		function timeOut(){
	        			if (wait !== 0) {
	        				$("#seconds").text(--wait);
	        				setTimeout(function(){
	        					timeOut();
	        				}, 1000);
	        			}
	        		}
	        		setTimeout(function(){
	        			JumpToLog();
	        		},4000);

	        	}else{
	        		err_jump_message.innerHTML = "This username already exists";
	        		setTimeout(function(){
						err_jump_message.innerHTML = "";
	        		},3000)
	        	}
	        },error:function(){
	        	console.log("error");
	        }
	      });
	}

	usernameOnChange(e){
		var username = e.target.value;
		this.setState({username: username});
		if(username==''){
			checkName.innerHTML = "username cannot empty";
			$("#create-account").prop('disabled', true);
		}else{
			checkName.innerHTML = "";
		}
	}

	passwordOnChange(e){
		var password = e.target.value;
		this.setState({password: password});
		$("#create-account").prop('disabled', true);
		if(password==''){
			checkPass.innerHTML = "password cannot empty";
		}
		else if(password.length < 6){
			checkPass.innerHTML = "must be at least 6 characters";
		}
		else if(password.length >= 7){
			checkPass.innerHTML = "";
		}
		else if(! /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])/.exec(password)){
			checkPass.innerHTML = "must contain letters and numbers";
		}
		else if(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])/.exec(password)){
			checkPass.innerHTML = "";
		}
		else{
			checkPass.innerHTML = "";
			if (checkConfirm.innerHTML == ""){
				$("#create-account").prop('disabled', false);
			}
			else {
				$("#create-account").prop('disabled', true);
			}
		}
		if(this.state.checkPassowrd != password){
			checkConfirm.innerHTML = "password not match";
			$("#create-account").prop('disabled', true);
		}
		else if (this.state.checkPassowrd == password){
			checkConfirm.innerHTML = "";
		}


	}

	checkPasswordOnChange(e){
		var confirmPassword = e.target.value;
		this.setState({checkPassowrd: e.target.value});
		$("#create-account").prop('disabled', true);

		if(this.state.password!=confirmPassword){
			checkConfirm.innerHTML = "password not match";
		}
		else{
			checkConfirm.innerHTML = "";
			if (checkPass.innerHTML == ""){
				$("#create-account").prop('disabled', false);
			}
			else {
				$("#create-account").prop('disabled', true);
			}
		}
	}

	emailOnChange(e){
		var email = e.target.value;
		this.setState({email:email});
	}

	sexOnChange(e){
		var sex = e.target.value;
		this.setState({gender: sex});
	}

	componentDidMount(){
		$("#create-account").prop('disabled', true);
	}

	handleClick(e){
		JumpToLog();
	}

	render(){
		return(
			<form className="register-form" onSubmit={this.handelSubmit}>
			    <div id = "show_mes">
				    <p id="err_jump_message"></p><a id="seconds"></a>
				</div>

				<h4> 
					*Username: 
					<input id="user-name" className="form-content" type="text" onChange={this.usernameOnChange}/>
					<span id = "checkName" />
				</h4>

				<h4> 
					Email:    
					<input id = "email" className="form-content" type="text" onChange={this.emailOnChange}/>
					<span id = "checkEmail" />
				</h4>

				<h4> 
					*Password: 
					<input id="password" className="form-content" type="password" onChange={this.passwordOnChange}/>
	 				<span id = "checkPass" />
	 			</h4>

				<h4> 
					*Confirm Password: 
					<input id="c-password" className = "form-content" type="password" onChange={this.checkPasswordOnChange}/>
					<span id = "checkConfirm" />
				</h4>

				<p id ="gender">
					Clothing preference:
					<input type="radio" name="sex" value="M" onChange={this.sexOnChange}/> Male
					<input type="radio" name="sex" value="F" onChange={this.sexOnChange}/> Female
					<span id = "checkGender" />
				</p>

				<button id="create-account">Create Account </button>
				<p class = "olduser">
				    Already has an account?
				    <a onClick = {this.handleClick} href="#">Log in</a>
				</p>
			</form>
		) 
	}
}
