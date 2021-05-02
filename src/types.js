import { handler } from '@humanmade/repress';

const root = window.ObscuraVars.api;

const media = new handler( {
	type: 'media',
	url: `${ root }wp/v2/media`,
	nonce: window.ObscuraVars.nonce,
} );
media.uploadSingle = ( function ( file ) {
	return dispatch => {
		// Create temporary ID to allow tracking request.
		const id = '_tmp_' + this.tempId++;

		dispatch( { type: this.actions.createStart, id, data: {} } );

		const options = {
			method: 'POST',
			body: new FormData(),
		};
		options.body.append( 'file', file );
		return this.fetch( this.url, { context: 'edit' }, options )
			.then( data => {
				dispatch( { type: this.actions.createSuccess, id, data } );
				return data.id;
			} )
			.catch( error => {
				dispatch( { type: this.actions.createError, id, error } );

				// Rethrow for other promise handlers.
				if ( this.rethrow ) {
					throw error;
				}
			} );
	};
} ).bind( media );

const users = new handler( {
	type: 'users',
	url: `${ root }wp/v2/users`,
	nonce: window.ObscuraVars.nonce,
} );
users.registerArchive( 'me', state => ( { include: state.ui.user } ) );

export {
	media,
	users,
};
