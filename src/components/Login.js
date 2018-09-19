import React from 'react';

import Button from './Button';

import './Login.css';

export default class Login extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			url: '',
		};
	}

	onSubmit = e => {
		e.preventDefault();

		this.props.onSubmit( this.state.url );
	}

	render() {
		return (
			<form
				className="login"
				onSubmit={ this.onSubmit }
			>
				<label>
					<span>Site Address</span>
					<input
						name="wp_site_url"
						type="url"
						value={ this.state.url }
						onChange={ e => this.setState( { url: e.target.value } ) }
					/>
				</label>

				<Button submit>Connect</Button>
			</form>
		);
	}
}
