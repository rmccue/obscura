import { handler } from '@humanmade/repress';

// Temporary URL, which will be replaced by the real URL after connecting.
const DUMMY_URL = '__DUMMY_URL__';

const media = new handler( {
	type: 'media',
	url: `${ DUMMY_URL }/wp/v2/media`,
	fetchOptions: {},
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
	url: `${ DUMMY_URL }/wp/v2/users`,
	fetchOptions: {},
} );
users.registerArchive( 'me', state => ( { include: state.ui.user } ) );

const configureHandlers = data => {
	[ media, users ].forEach( handler => {
		handler.url = handler.url.replace( DUMMY_URL, data.url );

		// Repress currently overrides fetchOptions.headers, so we need to
		// use query instead.
		// handler.fetchOptions = {
		// 	...( handler.fetchOptions || {} ),
		// 	headers: {
		// 		Authorization: `Bearer ${ data.token }`
		// 	},
		// };

		handler.query = {
			...handler.query,
			access_token: data.token,
		};
	} );
};

export {
	configureHandlers,
	media,
	users,
};
