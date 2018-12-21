import nanoid from 'nanoid';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Button from './Button';
import Main from './Main';
import Welcome from './Welcome';
import { fetchCurrentUser, resetCurrentUser } from '../actions';
import { configureHandlers } from '../types';

import './App.css';

const CREDENTIALS_KEY = 'pressograph-creds';
const CONNECT_STATE = {
	CONNECT: 'CONNECT',
	CONNECTED: 'CONNECTED',
};
const UI_STATE = {
	LOADING: 'LOADING',
	LOADING_USER: 'LOADING_USER',
	LOADED: 'LOADED',
	LOAD_ERROR: 'LOAD_ERROR',
	SETUP: 'SETUP',
	EXCHANGING: 'EXCHANGING',
	EXCHANGE_ERROR: 'EXCHANGE_ERROR',
};
const ERRORS = {
	MISSING_PARAMS: 'MISSING_PARAMS',
	CSRF_MISMATCH: 'CSRF_MISMATCH',
	BAD_RESPONSE: 'BAD_RESPONSE',
};

class App extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			state: UI_STATE.LOADING,
		};
	}

	componentDidMount() {
		// Load details from localStorage.
		const data = window.localStorage.getItem( CREDENTIALS_KEY );
		if ( ! data ) {
			this.setState( { state: UI_STATE.SETUP } );
			return;
		}

		const parsed = JSON.parse( data );
		if ( ! parsed ) {
			return;
		}

		if ( ! this.onLoadCredentials( parsed ) ) {
			this.setState( { state: UI_STATE.SETUP } );
		}
	}

	onLoadCredentials( data ) {
		if ( ! data.state ) {
			return false;
		}

		switch ( data.state ) {
			case CONNECT_STATE.CONNECT: {
				this.onConnect( data );
				return true;
			}

			case CONNECT_STATE.CONNECTED: {
				this.onConnected( data );
				return true;
			}

			default:
				return false;
		}
	}

	onConnect( data ) {
		this.setState( { state: UI_STATE.EXCHANGING } );

		const query = queryString.parse( window.location.search );

		// Wipe query parameters.
		this.props.history.replace( this.props.history.basename );

		if ( ! query.code || ! query.brokered_id || ! query.brokered_root || ! query.state ) {
			this.setState( {
				state: UI_STATE.EXCHANGE_ERROR,
				error: ERRORS.MISSING_PARAMS,
			} );
			return;
		}

		if ( query.state !== data.token ) {
			console.log( query.state, data.token );
			this.setState( {
				state: UI_STATE.EXCHANGE_ERROR,
				error: ERRORS.CSRF_MISMATCH,
			} );
			return;
		}

		const root_url = query.brokered_root.replace( /\/$/, '' );

		const exchangeUrl = `${ root_url }/oauth2/access_token`;
		const args = {
			grant_type: 'authorization_code',
			code: query.code,
			redirect_uri: data.redirect_uri,
			client_id: query.brokered_id,
		};
		const opts = {
			method: 'POST',
			body: queryString.stringify( args ),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		};

		// Exchange the code for a token.
		fetch( exchangeUrl, opts )
			.then( resp => {
				resp.json().then( respData => {
					if ( ! resp.ok ) {
						this.setState( {
							state: UI_STATE.EXCHANGE_ERROR,
							error: ERRORS.BAD_RESPONSE,
						} );
						console.log( 'ERROR' );
						return;
					}

					const nextData = {
						state: CONNECT_STATE.CONNECTED,
						id: query.brokered_id,
						url: root_url,
						token: respData.access_token,
					};
					window.localStorage.setItem( CREDENTIALS_KEY, JSON.stringify( nextData ) );
					this.onConnected( nextData );
				} );
			} );
	}

	onConnected( data ) {
		configureHandlers( data );

		this.setState( {
			state: UI_STATE.LOADING_USER,
		} );

		// Load in our user.
		this.props.onLoadCurrentUser()
			.then( id => {
				this.setState( {
					state: UI_STATE.LOADED,
				} );
			} )
			.catch( err => {
				console.log( err );
				this.setState( {
					state: UI_STATE.LOAD_ERROR,
				} );
			} );
	}

	onLogIn = url => {
		// Create a state token.
		const token = nanoid();

		// Build our redirection URL.
		const args = {
			client_id: this.props.appId,
			autodiscover: 'true',
			redirect_uri: '' + window.location,
			response_type: 'code',
			site: url,
			state: token,
		};
		const redirectUrl = this.props.centralUrl + '?' + queryString.stringify( args );

		// Save relevant details for later extraction.
		const data = {
			state: CONNECT_STATE.CONNECT,
			redirect_uri: args.redirect_uri,
			token,
			url,
		};
		window.localStorage.setItem( CREDENTIALS_KEY, JSON.stringify( data ) );

		// Finally, redirect to the connection URL.
		window.location = redirectUrl;
	}

	onLogOut = () => {
		// Reset localStorage first.
		window.localStorage.removeItem( CREDENTIALS_KEY );

		// Reset handlers.
		configureHandlers( { url: '', token: '' } );

		// Reset current user.
		this.props.onResetCurrentUser()

		// Finally, reset state to re-render.
		this.setState( {
			state: UI_STATE.SETUP,
		} );
	}

	render() {
		switch ( this.state.state ) {
			case UI_STATE.LOADING:
				return (
					<div className="app__loading">
						<p>Loading…</p>
					</div>
				);

			case UI_STATE.LOADING_USER:
				return (
					<div className="app__loading">
						<p>Loading site…</p>
					</div>
				);

			case UI_STATE.LOADED:
				return (
					<Main
						onLogOut={ this.onLogOut }
					/>
				);

			case UI_STATE.LOAD_ERROR:
				return (
					<div className="app__load-error">
						<p>Unable to load site!</p>
					</div>
				);

			case UI_STATE.SETUP:
				return (
					<Welcome
						onLogIn={ this.onLogIn }
					/>
				);

			case UI_STATE.EXCHANGING:
				return (
					<div className="app__loading">
						<p>Completing connection process…</p>
					</div>
				);

			case UI_STATE.EXCHANGE_ERROR:
				return (
					<div className="app__load-error">
						<div>
							<p>Unable to connect to site.</p>
							<p><code>{ this.state.error }</code></p>
							<Button onClick={ this.onLogOut }>Try Again</Button>
						</div>
					</div>
				);

			default:
				return (
					<div className="app__load-error">
						<p>UNKNOWN STATE!</p>
					</div>
				);
		}
	}
}

const mapStateToProps = () => ( {} );

const mapDispatchToProps = dispatch => {
	return {
		onLoadCurrentUser: () => dispatch( fetchCurrentUser() ),
		onResetCurrentUser: () => dispatch( resetCurrentUser() ),
	};
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
