import { withSingle } from '@humanmade/repress';
import React from 'react';
import { Facebook } from 'react-content-loader';
import { FormattedDate } from 'react-intl';

import Button from '../Button';
import TextField from '../Form/TextField';
import { media } from '../../types';

import './Details.css';

class Details extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {};
	}

	onSubmit = e => {
		e.preventDefault();

		const reset = {};
		Object.keys( this.state ).forEach( key => {
			reset[ key ] = undefined;
		} );
		this.props.onUpdatePost( this.state )
			.then( () => {
				this.setState( {} )
			} );
	}

	render() {
		const { loading, post } = this.props;

		if ( loading ) {
			return (
				<div className="details">
					<Facebook />
				</div>
			);
		}

		if ( ! post ) {
			return (
				<div className="details">
					Could not load item.
				</div>
			);
		}

		const hasEditable = 'raw' in post.title;

		return (
			<div className="details">
				<div className="details__main">
					<img
						alt={ post.title.rendered }
						className="details__image"
						src={ post.source_url }
					/>
				</div>
				<div className="details__properties">
					<ul className="details__inherent">
						<li>File name: { post.media_details.file && post.media_details.file.split( '/' ).slice( -1 )[0] }</li>
						<li>File type: { post.mime_type }</li>
						<li>
							Uploaded on:
							{ ' ' }
							<time
								dateTime={ post.date_gmt + 'Z' }
								title={ post.date_gmt + 'Z' }
							>
								<FormattedDate value={ post.date_gmt + 'Z' } />
							</time>
						</li>
						<li>Dimensions: { post.media_details.width } × { post.media_details.height }</li>
					</ul>

					<form onSubmit={ this.onSubmit }>
						<ul className="details__post">
							<li>
								<label>
									<span>Title:</span>
									<TextField
										disabled={ ! hasEditable }
										value={ hasEditable ? ( this.state.title || post.title.raw ) : post.title.rendered }
										onChange={ e => this.setState( { title: e.target.value } ) }
									/>
								</label>
							</li>
							<li>
								<label>
									<span>Alt Text:</span>
									<TextField
										disabled={ ! hasEditable }
										value={ this.state.alt_text || post.alt_text }
										onChange={ e => this.setState( { alt_text: e.target.value } ) }
									/>
								</label>
							</li>
							<li>
								<label>
									<span>Caption:</span>
									<TextField
										disabled={ ! hasEditable }
										value={ hasEditable ? ( this.state.caption || post.caption.raw ) : post.caption.rendered }
										onChange={ e => this.setState( { caption: e.target.value } ) }
									/>
								</label>
							</li>
						</ul>

						{ hasEditable ? (
							<Button
								disabled={ this.props.saving }
								submit
							>
								{ this.props.saving ? 'Saving…' : 'Save' }
							</Button>
						) : (
							<Button
								onClick={ () => this.props.onLoad( 'edit' ) }
							>
								Edit
							</Button>
						) }
					</form>
				</div>
			</div>
		);
	}
}

export default withSingle(
	media,
	state => state.media,
	props => props.id
)( Details );
