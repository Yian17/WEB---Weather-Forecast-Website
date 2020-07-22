//message refresh rate
var second = 3;

class Messages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: {},
			stop: false,
			sendMessage: ''
		};

		this.refreshMessage = this.refreshMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.updateSendMessage = this.updateSendMessage.bind(this);
	}

	updateSendMessage(e) {
		var message = e.target.value;
		this.setState({ sendMessage: message });

		// block send button if there is no text to send
		if (message.length < 1) {
			$("#sendMessage").prop('disabled', true);
		} else {
			$("#sendMessage").prop('disabled', false);
		}
	}

	sendMessage(e) {
		var self = this;
		var url = window.location.origin + "/api/messages";

		e.preventDefault();

		var messageData = {
			data: this.state.sendMessage
		};

		if (messageData.content == '') {
			alert("invalid input");
			return;
		}

		$.ajax({
			type: "POST",
			contentType: 'application/json',
			dataType: 'json',
			url: url,
			data: JSON.stringify(messageData),
			success: function (data) {
				self.setState({
					sendMessage: ''
				});

				$("#messageIDField").val('');
				$("#messageField").val('');
				$("#sendMessage").prop('disabled', true);

				if (!data) {
					alert("cannot send this message");
					return;
				}
			}, error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Network Error: cannot send this message");
			}
		});
	}

	refreshMessage() {
		var self = this;
		var url = window.location.origin + "/api/messages";

		$.ajax({
			type: "GET",
			cache: false,
			url: url,
			success: function (data) {
				//when ever a message come in,
				//message body will stick to the latest message
				//at the buttom
				if (JSON.stringify(data) !== JSON.stringify(self.state.message)) {
					self.setState({ message: data });
					$("#message").scrollTop(1000000);
				}

				//refresh messages every 3 seconds
				if (!self.state.stop) {
					setTimeout(function () {
						self.refreshMessage();
					}, second * 1000);
				}
			}, error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("abnormal network connection");
			}
		});
	}

	componentDidMount() {
		$("#sendMessage").prop('disabled', true);
		this.refreshMessage();
	}

	componentWillUnmount() {
		this.setState({ stop: true });
	}

	render() {
		return React.createElement(
			'div',
			null,
			React.createElement(MessageList, { content: this.state.message }),
			React.createElement(
				'form',
				{ id: 'sendMessageForm', onSubmit: this.sendMessage },
				React.createElement('input', { type: 'text', id: 'messageField', placeholder: 'Message', onChange: this.updateSendMessage }),
				React.createElement(
					'button',
					{ id: 'sendMessage' },
					'Send'
				)
			)
		);
	}
}

class MessageList extends React.Component {
	constructor(props) {
		super(props);

		this.showHistory = this.showHistory.bind(this);
		this.hideHistory = this.hideHistory.bind(this);
	}

	showHistory() {
		$("#sendMessageForm").show();
		$("#history").show();
		$("#showHistory").hide();
		$("#hideHistory").show();
		$("#message").scrollTop(1000000);
		$("#recentMessage").css({
			"background": "#f6f7f9",
			"color": "black"
		});
	}

	hideHistory() {
		$("#sendMessageForm").hide();
		$("#history").hide();
		$("#showHistory").show();
		$("#hideHistory").hide();
		$("#recentMessage").css({
			"background": "rgba(255,255,255,0.4)",
			"color": "#fafafa"
		});
	}

	componentDidMount() {
		this.hideHistory();
	}

	render() {
		var messages = this.props.content;
		var messagesList = [];
		var recentMessage = {};

		if (messages.length > 0) {
			recentMessage = messages[messages.length - 1];
		} else {
			recentMessage = { id: '', content: '' };
		}

		for (var index in messages) {
			var temp = messages[index];
			var message = {
				id: temp.id,
				content: temp.content
			};
			messagesList.push(message);
		}

		return React.createElement(
			'div',
			{ id: 'messageList' },
			React.createElement(
				'div',
				{ id: 'recentMessage' },
				React.createElement(
					'span',
					null,
					'Recent Message: ',
					recentMessage.content,
					' (',
					recentMessage.id,
					')'
				),
				React.createElement(
					'button',
					{ id: 'showHistory', onClick: this.showHistory },
					'history'
				),
				React.createElement(
					'button',
					{ id: 'hideHistory', onClick: this.hideHistory },
					'hide'
				)
			),
			React.createElement(
				'div',
				{ id: 'history' },
				React.createElement(
					'span',
					{ id: 'historyTitle' },
					'History:'
				),
				React.createElement('br', null),
				messagesList.map(item => React.createElement(
					'span',
					{ key: "mid_" + item.id },
					'id(',
					item.id,
					'):',
					item.content,
					React.createElement('br', null)
				))
			)
		);
	}
}

