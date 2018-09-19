import { users } from './types';

export const SET_DATE_FILTER_DURATION = 'SET_DATE_FILTER_DURATION';
export const SET_DATE_FILTER_RANGE = 'SET_DATE_FILTER_RANGE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LIBRARY_VIEW = 'SET_LIBRARY_VIEW';
export const SET_SORT = 'SET_SORT';
export const SET_TYPE_FILTER = 'SET_TYPE_FILTER';

export const fetchCurrentUser = () => ( dispatch, getState ) => {
	return users.fetch( `${ users.url }/me`, { context: 'edit' } )
		.then( data => {
			const id = data.id;
			dispatch( { type: SET_CURRENT_USER, id } );
			dispatch( { type: users.actions.getSuccess, id, data } );
			return id;
		} )
		.catch( error => {
			// Rethrow for other promise handlers.
			if ( users.rethrow ) {
				throw error;
			}
		} );
};

export const resetCurrentUser = () => ( { type: SET_CURRENT_USER, id: null } );

export const setDateFilterDuration = duration => ( { type: SET_DATE_FILTER_DURATION, duration } );
export const setDateFilterRange = ( start, end ) => ( { type: SET_DATE_FILTER_RANGE, start, end } );
export const setLibraryView = view => ( { type: SET_LIBRARY_VIEW, view } );
export const setSort = sort => ( { type: SET_SORT, sort } );
export const setTypeFilter = filter => ( { type: SET_TYPE_FILTER, filter } );
