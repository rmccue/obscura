import { SET_CURRENT_USER } from '../actions';

const DEFAULT_STATE = {
	user: null,
};

export default function users( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SET_CURRENT_USER:
			return {
				...state,
				user: action.id,
			};

		default:
			return state;
	}
}
