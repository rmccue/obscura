import React, { useState } from 'react';

import { Attachment } from '../../api';

import './Preview.css';

/*
<script type="text/html" id="tmpl-hm-thumbnail-sizes">
	<h2 class="screen-reader-text"><?php esc_html_e( 'Image sizes', 'hm-smart-media' ); ?></h2>
	<ul class="hm-thumbnail-sizes__list">
		<li>
			<button type="button" data-size="full" class="{{ data.model.get( 'size' ) === 'full' ? 'current' : '' }}">
				<h3>
					<?php esc_html_e( 'Original' ); ?>
					<small>{{ data.model.get( 'width' ) }} x {{ data.model.get( 'height' ) }}</small>
				</h3>
				<img src="{{ data.model.get( 'url' ) + ( data.model.get( 'url' ).indexOf( '?' ) >= 0 ? '&amp;' : '?' ) }}fit=0,120" width="{{ data.model.get( 'width' ) }}" height="{{ data.model.get( 'height' ) }}" alt="original" draggable="false" />
			</button>
		</li>
		<# if ( data.model.get( 'mime' ).match( /image\/(jpe?g|png|gif)/ ) ) { #>
			<# _.each( data.model.get( 'sizes' ), function ( props, size ) { #>
				<# if ( size && size !== 'full' && size !== 'full-orig' ) { #>
				<li>
					<button type="button" data-size="{{ size }}" class="{{ data.model.get( 'size' ) === size ? 'current' : '' }}">
						<h3>
							<# if ( props.label ) { #>
								{{ props.label }}
							<# } else { #>
								<code>{{ size }}</code>
							<# } #>
							<small>{{ props.width }} x {{ props.height }}</small>
						</h3>
						<img src="{{ props.url }}" height="80" alt="{{ size }}" draggable="false" />
					</button>
				</li>
				<# } #>
			<# } ); #>
		<# } #>
	</ul>
</script>
*/

type RegisteredSize = {
	label: string,
	width: number,
	height: number,
	crop: boolean,
	orientation: 'landscape' | 'portrait',
};

const REGISTERED_SIZES: { [ k: string ]: RegisteredSize } = ( window as any ).ObscuraVars.data.sizes;

type Size = {
	file: string,
	height: number,
	mime_type: string,
	source_url: string,
	width: number,
}

interface Props {
	post: Attachment,
}

export default function Preview( props: Props ) {
	const { post } = props;

	const [ selected, setSelected ] = useState<string>( 'full' );

	const hasSizes = post.media_type === 'image';
	if ( ! hasSizes || ! post.media_details ) {
		return null;
	}

	const sizes = post.media_details.sizes as { [ k: string ]: Size };
	const current = sizes[ selected ];
	const onSelect = ( size: string ) => setSelected( size );

	return (
		<div className="details-preview">
			{ hasSizes && (
				<div className="details-preview__sizes">
					{ Object.entries( sizes ).map( ( [ size, sizeData ] ) => (
						<li
							key={ size }
							className={ [
								'details-preview__size-select',
								size === selected && 'details-preview__size-select--current'
							].filter( Boolean ).join( ' ' ) }
						>
							<button
								type="button"
								onClick={ () => onSelect( size ) }
							>
								<p className="details-preview__size-meta">
									<span className="details-preview__size-name">
										{ REGISTERED_SIZES[ size ].label || ( <code>{ size }</code> ) }
									</span>
									<small>{ sizeData.width } &times; { sizeData.height }</small>
								</p>
								<div className="details-preview__size-preview-wrap">
									<img
										alt={ size }
										className="details-preview__size-preview"
										src={ sizeData.source_url }
									/>
								</div>
							</button>
						</li>
					) ) }
				</div>
			) }
			<div className="details-preview__main">
				<img
					alt={ selected }
					className="details-preview__image"
					src={ current.source_url }
				/>
			</div>
		</div>
	);
}
