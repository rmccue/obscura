import {
	Button,
	ClipboardButton,
	ExternalLink,
	Panel,
	PanelBody,
	PanelRow,
	TextareaControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { withSingle } from '@humanmade/repress';
import { Facebook } from 'react-content-loader';
import { FormattedDate } from 'react-intl';

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
					<Panel>
						<PanelBody>
							<ul className="details__inherent">
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
								<li>File name: { post.media_details.file && post.media_details.file.split( '/' ).slice( -1 )[0] }</li>
								<li>File type: { post.mime_type }</li>
								<li>Dimensions: { post.media_details.width } × { post.media_details.height } pixels</li>
							</ul>
							<div>
								<TextControl
									label={ __( 'File URL', 'obscura' ) }
									readOnly
									value={ post.source_url }
								/>
								<ClipboardButton
									isSecondary
									isSmall
									text={ post.source_url }
									onCopy={ () => console.log( 'copying' ) }
									onFinishCopy={ () => console.log( 'copied' ) }
								>
									{ __( 'Copy URL to clipboard', 'obscura' ) }
								</ClipboardButton>
							</div>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<TextControl
								disabled={ ! hasEditable }
								label="Title"
								value={ hasEditable ? ( this.state.title || post.title.raw ) : post.title.rendered }
								onChange={ title => this.setState( { title } ) }
							/>
							<TextControl
								className="details__alt-text"
								disabled={ ! hasEditable }
								label="Alternative Text"
								help={ (
									<>
										Describe the purpose of the image.
										Leave empty if the image is purely decorative.

										<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">Read more</ExternalLink>
									</>
								) }
								value={ this.state.alt_text || post.alt_text }
								onChange={ alt_text => this.setState( { alt_text } ) }
							/>
							<TextareaControl
								disabled={ ! hasEditable }
								label="Caption"
								value={ hasEditable ? ( this.state.caption || post.caption.raw ) : post.caption.rendered }
								onChange={ caption => this.setState( { caption } )}
							/>

							{ hasEditable ? (
								<Button
									disabled={ this.props.saving }
									isBusy={ this.props.saving }
									isPrimary
									onClick={ this.onSubmit }
								>
									{ this.props.saving ? 'Saving…' : 'Save' }
								</Button>
							) : (
								<Button
									isPrimary
									onClick={ () => this.props.onLoad( 'edit' ) }
								>
									Edit
								</Button>
							) }
						</PanelBody>
					</Panel>
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
