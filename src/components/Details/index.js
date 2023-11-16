import {
	Button,
	ClipboardButton,
	ComplementaryAreaHeader,
	ExternalLink,
	Panel,
	PanelBody,
	TextareaControl,
	TextControl,
} from '@wordpress/components';
import * as Foo from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ComplementaryArea } from '@wordpress/interface';
import * as Interface from '@wordpress/interface';
import { __ } from '@wordpress/i18n';

import { useSingle } from '@humanmade/repress';
import { Facebook } from 'react-content-loader';
import { FormattedDate } from 'react-intl';

import ImageMeta from './ImageMeta';
import { media } from '../../types';

import './Details.css';
import Preview from "./Preview";

export function Details( props ) {
	console.log( ComplementaryAreaHeader, Interface );
	const [ data, _setData ] = useState( {} );
	const setData = newData => _setData( { ...data, ...newData } );

	const { loading, post, load } = useSingle( media, state => state.media, props.id );

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

	const onSubmit = e => {
		e.preventDefault();

		props.onUpdatePost( data )
			.then( () => {
				_setData( {} )
			} );
	}

	const hasEditable = 'raw' in post.title;

	return (
		<div className="details">
			<Preview
				post={ post }
			/>
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
							value={ hasEditable ? ( data.title || post.title.raw ) : post.title.rendered }
							onChange={ title => setData( { title } ) }
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
							value={ data.alt_text || post.alt_text }
							onChange={ alt_text => setData( { alt_text } ) }
						/>
						<TextareaControl
							disabled={ ! hasEditable }
							label="Caption"
							value={ hasEditable ? ( data.caption || post.caption.raw ) : post.caption.rendered }
							onChange={ caption => setData( { caption } )}
						/>

						{ hasEditable ? (
							<Button
								disabled={ props.saving }
								isBusy={ props.saving }
								isPrimary
								onClick={ onSubmit }
							>
								{ props.saving ? 'Saving…' : 'Save' }
							</Button>
						) : (
							<Button
								isPrimary
								onClick={ () => load( 'edit' ) }
							>
								Edit
							</Button>
						) }
					</PanelBody>
				</Panel>

				<Panel>
					<PanelBody>
						<ImageMeta
							meta={ post.media_details.image_meta }
						/>
					</PanelBody>
				</Panel>
			</div>
		</div>
	);
}

export default Details;
