class UserLogIn extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: '',
			isRemember: false
		};

		this.handelLogin = this.handelLogin.bind(this);
		this.handleGotoRegister = this.handleGotoRegister.bind(this);
		this.usernameOnChange = this.usernameOnChange.bind(this);
		this.passwordOnChange = this.passwordOnChange.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this)
	}
	handelLogin(e){
		e.preventDefault();

		var url = origin + "/api/users/login";

		var userData = this.state;

	    $.ajax({
		    type:"POST",
		    contentType: 'application/json',
	        dataType: 'json',
		    url: url,
		    data: JSON.stringify(userData),
		    success: function (data) {
		    	if(data==false){
		    		$("#err_message").text("Wrong Username or Password! Try again.");
				    data = JSON.stringify(data);
				    $("#userInfo").empty();
				    $("#userInfo").append(`<span>`+data+`</span>`);
				}else{
				    $("#login").hide();
				    hideLogIn();
				    deterShowUserInfo();
				}
			},error:function(){
	        	console.log("error");
	        }
		});
	}
	usernameOnChange(e){
		var username = e.target.value;
		if(username === ''){
            $("#err_message").text("Username can not be empty!"); 
        } else {
        	$("#err_message").text('');
        }
		this.setState({username: username});

		if(username==='') return;

		var self=this;
		var url = document.location.origin+'/api/users/getPassword/'+username;
		$.ajax({
			type: 'GET',
			url: url,
			success: function(data){
				if(data==false){
					$("#input_password").val("");
				}else{
					self.setState({
						password: data,
						isRemember: true,
					});

					$("#input_password").val(data);
					$('#remember').prop('checked', true);
				}
			}
		});
	}

	passwordOnChange(e){
		var password = e.target.value;
		if(password === ''){
            $("#err_message").text("Password can not be empty!"); 
        } else {
        	$("#err_message").text('');
        }
		this.setState({password: password});
	}
	handleCheckbox(e){
        let isChecked = e.target.checked;
        if(isChecked){
            this.setState({
                isRemember: true
            })
        }else{
            this.setState({
                isRemember: false
            })
        }
    }
	handleGotoRegister(e){
		JumpRegister();
	}


	render(){
		return(
			<form className="loginform">

			    <div id = "s_message">
				    <p id="err_message"></p>
				    <a id="scds"></a>
				</div>

 			    <input className="inputbar" type="text" placeholder="Username" id="input_user_name" onChange={this.usernameOnChange}/><br/>
 			    
 			    <input className="inputbar" type="password" placeholder="Password" id="input_password" onChange={this.passwordOnChange}/><br/>

 			    <label className="rememberPassword"><input id="remember" type="checkbox" checked={this.state.isRemember} onClick={this.handleCheckbox}/>Remember Password?</label><br/>

  			    <button id="submit_button" onClick={this.handelLogin}>Log In</button><br/>

 			    <p className="no_message">New user? <a onClick={this.handleGotoRegister} id="rn" href="#">Register Now</a></p>

			</form>
		)
	}
}
