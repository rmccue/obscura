import React from 'react';
import { Attachment } from '../../api';

// 'aperture' => 0,
// 'credit' => '',
// 'camera' => '',
// 'caption' => '',
// 'created_timestamp' => 0,
// 'copyright' => '',
// 'focal_length' => 0,
// 'iso' => 0,
// 'shutter_speed' => 0,
// 'title' => '',
// 'orientation' => 0,
// 'keywords' => array(),

type MetaMap = {
	[ k: string ] : {
		title: string,
		render?( value: any ): string,
	}
}
const META_MAP: MetaMap = {
	aperture: {
		title: 'Aperture',
	},
	camera: {
		title: 'Camera',
	},
	caption: {
		title: 'Caption',
	},
	credit: {
		title: 'Credit',
	},
	created_timestamp: {
		title: 'Created at',
	},
	copyright: {
		title: 'Copyright',
	},
	focal_length: {
		title: 'Focal Length',
	},
	keywords: {
		title: 'Keywords',
		render: ( value: string[] ) => value.join( ', ' ),
	},
	iso: {
		title: 'ISO',
	},
	orientation: {
		title: 'Orientation',
	},
	shutter_speed: {
		title: 'Shutter Speed',
	},
	title: {
		title: 'Title',
	},
};

interface Props {
	meta: {
		[ k: string ]: any,
	},
}

export default function ImageMeta( props: Props ) {
	return (
		<ul>
			{ Object.entries( META_MAP ).map( ( [ field, opts ] ) => (
				<li
					key={ field }
				>
					{ opts.title }: { opts.render ? opts.render( props.meta[ field ] ) : props.meta[ field ] || '' }
				</li>
			) ) }
		</ul>
	);
}
