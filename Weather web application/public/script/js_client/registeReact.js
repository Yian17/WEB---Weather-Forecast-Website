class RegisteNew extends React.Component {
	constructor(props) {
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

	handelSubmit(e) {
		e.preventDefault();

		if (this.state.password == '' || this.state.username == '') {
			err_message.innerHTML = "have to have a username and a password";
			return;
		}

		var newUserdata = this.state;
		delete newUserdata.checkPassowrd;

		var url = window.location.origin + "/api/users";
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			url: url,
			data: JSON.stringify(newUserdata),
			success: function (data) {
				if (data !== false) {

					$("#err_jump_message").text("Jump to Log in page in");
					$("#seconds").text("3");
					var wait = $("#seconds").text();
					timeOut();
					function timeOut() {
						if (wait !== 0) {
							$("#seconds").text(--wait);
							setTimeout(function () {
								timeOut();
							}, 1000);
						}
					}
					setTimeout(function () {
						JumpToLog();
					}, 4000);
				} else {
					err_jump_message.innerHTML = "This username already exists";
					setTimeout(function () {
						err_jump_message.innerHTML = "";
					}, 3000);
				}
			}, error: function () {
				console.log("error");
			}
		});
	}

	usernameOnChange(e) {
		var username = e.target.value;
		this.setState({ username: username });
		if (username == '') {
			checkName.innerHTML = "username cannot empty";
			$("#create-account").prop('disabled', true);
		} else {
			checkName.innerHTML = "";
		}
	}

	passwordOnChange(e) {
		var password = e.target.value;
		this.setState({ password: password });
		$("#create-account").prop('disabled', true);
		if (password == '') {
			checkPass.innerHTML = "password cannot empty";
		} else if (password.length < 6) {
			checkPass.innerHTML = "must be at least 6 characters";
		} else if (password.length >= 7) {
			checkPass.innerHTML = "";
		} else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])/.exec(password)) {
			checkPass.innerHTML = "must contain letters and numbers";
		} else if (/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])/.exec(password)) {
			checkPass.innerHTML = "";
		} else {
			checkPass.innerHTML = "";
			if (checkConfirm.innerHTML == "") {
				$("#create-account").prop('disabled', false);
			} else {
				$("#create-account").prop('disabled', true);
			}
		}
		if (this.state.checkPassowrd != password) {
			checkConfirm.innerHTML = "password not match";
			$("#create-account").prop('disabled', true);
		} else if (this.state.checkPassowrd == password) {
			checkConfirm.innerHTML = "";
		}
	}

	checkPasswordOnChange(e) {
		var confirmPassword = e.target.value;
		this.setState({ checkPassowrd: e.target.value });
		$("#create-account").prop('disabled', true);

		if (this.state.password != confirmPassword) {
			checkConfirm.innerHTML = "password not match";
		} else {
			checkConfirm.innerHTML = "";
			if (checkPass.innerHTML == "") {
				$("#create-account").prop('disabled', false);
			} else {
				$("#create-account").prop('disabled', true);
			}
		}
	}

	emailOnChange(e) {
		var email = e.target.value;
		this.setState({ email: email });
	}

	sexOnChange(e) {
		var sex = e.target.value;
		this.setState({ gender: sex });
	}

	componentDidMount() {
		$("#create-account").prop('disabled', true);
	}

	handleClick(e) {
		JumpToLog();
	}

	render() {
		return React.createElement(
			'form',
			{ className: 'register-form', onSubmit: this.handelSubmit },
			React.createElement(
				'div',
				{ id: 'show_mes' },
				React.createElement('p', { id: 'err_jump_message' }),
				React.createElement('a', { id: 'seconds' })
			),
			React.createElement(
				'h4',
				null,
				'*Username:',
				React.createElement('input', { id: 'user-name', className: 'form-content', type: 'text', onChange: this.usernameOnChange }),
				React.createElement('span', { id: 'checkName' })
			),
			React.createElement(
				'h4',
				null,
				'Email:',
				React.createElement('input', { id: 'email', className: 'form-content', type: 'text', onChange: this.emailOnChange }),
				React.createElement('span', { id: 'checkEmail' })
			),
			React.createElement(
				'h4',
				null,
				'*Password:',
				React.createElement('input', { id: 'password', className: 'form-content', type: 'password', onChange: this.passwordOnChange }),
				React.createElement('span', { id: 'checkPass' })
			),
			React.createElement(
				'h4',
				null,
				'*Confirm Password:',
				React.createElement('input', { id: 'c-password', className: 'form-content', type: 'password', onChange: this.checkPasswordOnChange }),
				React.createElement('span', { id: 'checkConfirm' })
			),
			React.createElement(
				'p',
				{ id: 'gender' },
				'Clothing preference:',
				React.createElement('input', { type: 'radio', name: 'sex', value: 'M', onChange: this.sexOnChange }),
				' Male',
				React.createElement('input', { type: 'radio', name: 'sex', value: 'F', onChange: this.sexOnChange }),
				' Female',
				React.createElement('span', { id: 'checkGender' })
			),
			React.createElement(
				'button',
				{ id: 'create-account' },
				'Create Account '
			),
			React.createElement(
				'p',
				{ 'class': 'olduser' },
				'Already has an account?',
				React.createElement(
					'a',
					{ onClick: this.handleClick, href: '#' },
					'Log in'
				)
			)
		);
	}
}

