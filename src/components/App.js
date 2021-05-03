import { Component } from '@wordpress/element';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import Details from './Details';
import DropUpload from './DropUpload';
import Header from './Header';
import Library from './Library';
import Sidebar from './Sidebar';
import { media } from '../types';

import './App.css';

class Main extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			completed: [],
			files: [],
		};
		this.library = null;
	}

	onUpload = files => {
		this.setState( state => ( { files: [ ...state.files, ...files ] } ) );

		files.forEach( file => {
			this.props.onUpload( file ).then( id => {
				// Remove from uploading list
				this.setState( state => ( {
					files: state.files.filter( item => item !== file ),
				} ) );

				// Redirect to the new item.
				// TODO: We should also invalidate archives here.
				this.props.history.push( `/details/${ id }` );
			} );
		} );
	}

	render() {
		return (
			<div id="wp-media-grid">
				<Header
					uploading={ this.state.files }
					onLogOut={ this.props.onLogOut }
					onUpload={ this.onUpload }
				/>
				<Switch>
					<Route
						path="/details/:id"
						render={ props => (
							<Details
								id={ parseInt( props.match.params.id, 10 ) }
							/>
						) }
					/>
					<Route path="/" exact>
						<DropUpload
							className="main__library-wrap"
							onUpload={ this.onUpload }
						>
							<Sidebar />
							<Library
								ref={ ref => this.library = ref }
							/>
						</DropUpload>
					</Route>
					<Route>
						<p>404!</p>
					</Route>
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onUpload: file => dispatch( media.uploadSingle( file ) ),
	};
}

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( Main ) );
