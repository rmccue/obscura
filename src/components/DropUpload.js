import PropTypes from 'prop-types';
import React from 'react';

import './DropUpload.css';

const INITIAL_STATE = { dropping: false };

export default class DropUpload extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = { ...INITIAL_STATE };
	}

	onDragOver( e ) {
		e.preventDefault();

		// Explicitly show this is a copy.
		e.dataTransfer.dropEffect = 'copy';

		this.setState( { dropping: true } );
	}

	onDragLeave( e ) {
		e.preventDefault();

		this.setState( { dropping: false } );
	}

	onDrop( e ) {
		e.preventDefault();

		// If there's no files, ignore it.
		if ( ! e.dataTransfer.files.length ) {
			this.setState( { dropping: false } );
			return;
		}

		this.setState( { dropping: false } );
		this.props.onUpload( Array.from( e.dataTransfer.files ) );
	}

	render() {
		const { children, className } = this.props;

		return (
			<div
				className={ `dropupload ${ className || '' } ${ this.state.dropping ? 'dropupload--dropping' : ''}` }
				onDragOver={ e => this.onDragOver( e ) }
				onDragLeave={ e => this.onDragLeave( e ) }
				onDrop={ e => this.onDrop( e ) }
			>
				{ children }
			</div>
		);
	}
}

DropUpload.propTypes = {
	onUpload: PropTypes.func.isRequired,
};
