import React from 'react';

import './Uploader.css';

export default function Uploader( props ) {
	const { allowMultiple, files } = props;

	const onUpload = e => {
		e.preventDefault();

		// If there's no files, ignore it.
		if ( ! e.target.files.length ) {
			return;
		}

		props.onUpload( Array.from( e.target.files ) );
	};

	return (
		<div className="uploader">
			{ files.length === 1 ? (
				<p>
					<span className="Loading loading--active"></span>

					Uploading { files[0].name }…
				</p>
			) : files.length > 1 ? (
				<p>
					<span className="Loading loading--active"></span>

					Uploading multiple files…
				</p>
			) : (
				<label className="uploader--input button">
					<input
						multiple={ allowMultiple }
						type="file"
						onChange={ onUpload }
					/>
					Upload
				</label>
			) }
		</div>
	);
}
