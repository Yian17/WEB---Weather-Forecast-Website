class ProfileSettings extends React.Component {
	constructor(props) {
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

	handelSubmit(e) {
		e.preventDefault();

		var newUserdata = this.state;
		var url = window.location.origin + "/api/users/updateUserInfo";

		var newUserdata = this.state;
		delete newUserdata.checkPassowrd;

		$.ajax({
			type: "PUT",
			contentType: 'application/json',
			dataType: 'json',
			url: url,
			data: JSON.stringify(newUserdata),
			success: function (data) {
				if (data !== false) {
					deterShowUserInfo();
				} else {
					alert("Oooops, can not edit your profile.");
				}
			}, error: function () {
				console.log("error");
			}
		});
	}

	passwordOnChange(e) {
		var password = e.target.value;

		if (password != '') {
			this.setState({ password: password });
		}

		if (password != this.state.checkPassword) {
			checked_password.innerHTML = " Confirm Password must be the same with New Password!";
			$("#save-changes").prop('disabled', true);
		} else {
			checked_password.innerHTML = "";
		}
	}

	checkPasswordOnChange(e) {
		var confirmPassword = e.target.value;
		this.setState({ checkPassowrd: e.target.value });

		$("#save-changes").prop('disabled', true);

		if (this.state.password != confirmPassword) {
			checked_password.innerHTML = " Confirm Password must be the same with New Password!";
			$("#save-changes").prop('disabled', true);
		} else {
			checked_password.innerHTML = "";
			$("#save-changes").prop('disabled', false);
		}
	}

	emailOnChange(e) {
		var email = e.target.value;
		this.setState({ email: email });

		if (email == "") {
			//allow user remove their email
			setting_email.innerHTML = "";
			$("#save-changes").prop('disabled', false);
		} else if (!(email.indexOf('@') > -1)) {
			setting_email.innerHTML = " Email should be in the form of XXX@XXX.XX";
			$("#save-changes").prop('disabled', true);
		} else if (!(email.indexOf('.') > -1)) {
			setting_email.innerHTML = " Email address should contain \".\"";
			$("#save-changes").prop('disabled', true);
		} else {
			setting_email.innerHTML = "";
			$("#save-changes").prop('disabled', false);
		}
	}

	handleSexOnChange(e) {
		var gender = e.target.value;
		this.setState({ gender: gender });

		if (gender == "M" || gender == "F" || gender == "") {
			check_gender.innerHTML = "";
			$("#save-changes").prop('disabled', false);
		} else {
			check_gender.innerHTML = "Invalid gender(M/F)";
			$("#save-changes").prop('disabled', true);
		}
	}

	componentDidMount() {
		$("#save-changes").prop('disabled', true);
		this.setState(this.props.user);
	}

	render() {
		return React.createElement(
			'form',
			{ id: 'settingArea', onSubmit: this.handelSubmit },
			React.createElement(
				'h4',
				null,
				'User Name: ',
				this.state.username
			),
			React.createElement(
				'h4',
				null,
				'Email: ',
				React.createElement(
					'span',
					null,
					' '
				),
				React.createElement('input', { type: 'text', id: 'emailInput', onChange: this.emailOnChange, value: this.state.email == null ? "" : this.state.email }),
				React.createElement('span', { id: 'setting_email' })
			),
			React.createElement(
				'h4',
				null,
				'Gender:',
				React.createElement('input', { type: 'text', id: 'genderTextField', onChange: this.handleSexOnChange, value: this.state.gender == null ? "" : this.state.gender }),
				React.createElement('span', { id: 'check_gender' })
			),
			React.createElement(
				'h4',
				null,
				'Account created on:  ',
				this.state.createDate
			),
			React.createElement(
				'h4',
				null,
				'Visted:  ',
				this.state.visitCount,
				' times'
			),
			React.createElement(
				'h4',
				null,
				'New Password:',
				React.createElement('input', { type: 'password', id: 'passwordInput', onChange: this.passwordOnChange })
			),
			React.createElement(
				'h4',
				null,
				'Confirm Password:',
				React.createElement('input', { type: 'password', id: 'c-passwordInput', onChange: this.checkPasswordOnChange }),
				React.createElement('span', { id: 'checked_password' })
			),
			React.createElement(
				'button',
				{ id: 'save-changes' },
				'Save'
			)
		);
	}
}

