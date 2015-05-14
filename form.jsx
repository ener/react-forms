var ReactInput = React.createClass({
	getInitialState() {
		return {value: this.props.value};
	},
	handleChange: function (event) {
		if (this.isMounted()) {

			var value = event.target.value;
			this.setState({value: value});
			this.props.updateInput(this.props.name, value);
		}
	},
	render: function () {
		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<input type="text" name={this.props.name} value={this.props.value} onChange={this.handleChange} className="form-control" />
			</div>
		);
	}
});


var ReactForm = React.createClass({
	getInitialState: function () {
		return {data: []};
	},
	componentUpdate: function () {
		if (this.isMounted()) {
			$.ajax({
				url: '/inputs.json',
				dataType: 'json',
				success: function (data) {
					this.setState({data: data});
				}.bind(this),
				error: function (xhr, status, err) {
					console.error('inputs.json', status, err.toString());
				}.bind(this)
			});
		}

	},
	componentDidMount: function () {
		this.componentUpdate();
	},
	updateInput: function (name, value) {
		if (this.isMounted()) {
			var inputs = [];
			this.state.data.forEach(function (input_obj, i) {

				if (input_obj.name == name) {
					input_obj.value = value;
				}

				inputs.push(input_obj);

			}, inputs, name, value);


			this.setState({
				data: inputs
			});
		}
	},
	clearForm: function () {
		if (this.isMounted()) {
			var inputs = [];
			this.state.data.forEach(function (input_obj, i) {

				input_obj.value = '';

				inputs.push(input_obj);

			}, inputs);


			this.setState({
				data: inputs
			});
		}
	},
	sendForm: function (event) {
		if (!this.state.data) {
			return false;
		}

		var inputs = [];


		this.state.data.forEach(function (input_obj, i) {
			inputs.push(
				{name: input_obj.name, value: input_obj.value}
			);
		}, inputs);


		console.log(inputs);

		$.ajax({
			url: '/inputs.json',
			dataType: 'json',
			method: 'post',
			data: {"data": inputs},
			success: function (result) {
				if (result) {
					//success
				} else {
					//fail
				}
			}.bind(this),
			error: function (xhr, status, err) {
				console.error('inputs.json', status, err.toString());
			}.bind(this)
		});
	},
	render: function () {
		var inputs_content = [];

		if (this.state.data) {
			this.state.data.forEach(function (input_obj, i) {
				inputs_content.push(<ReactInput
					name={input_obj.name}
					value={input_obj.value}
					label={input_obj.label}
					updateInput={this.updateInput} i={i}/>);
			}, this);

		}
		return (
			<div className="form">
				{inputs_content}
				<button className="btn btn-lg btn-success" onClick={this.sendForm}>Submit</button>
				&nbsp;
				<button className="btn btn-lg btn-danger" onClick={this.clearForm}>Reset</button>
			</div>
		);
	}
});

React.render(
	<ReactForm />
	,
	document.getElementById('react-form')
);



