import {
	SET_DATE_FILTER_DURATION,
	SET_DATE_FILTER_RANGE,
	SET_LIBRARY_VIEW,
	SET_SORT,
	SET_TYPE_FILTER
} from '../actions';

import { DATE_FILTER_TYPE, DATE_RANGES, SORT_TYPES, VIEW_TYPES } from '../constants';

const DEFAULT_STATE = {
	date_filter: {
		type: DATE_FILTER_TYPE.RELATIVE,
		duration: DATE_RANGES.ALL,
	},
	sort: SORT_TYPES.DATE,
	type_filter: null,
	view: VIEW_TYPES.GRID,
};

export default function library( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SET_DATE_FILTER_DURATION:
			return {
				...state,
				date_filter: {
					type: DATE_FILTER_TYPE.RELATIVE,
					duration: action.duration,
				},
			};

		case SET_DATE_FILTER_RANGE:
			return {
				...state,
				date_filter: {
					type: DATE_FILTER_TYPE.ABSOLUTE,
					start: action.start,
					end: action.end,
				},
			};

		case SET_LIBRARY_VIEW:
			return {
				...state,
				view: action.view,
			};

		case SET_SORT:
			return {
				...state,
				sort: action.sort,
			};

		case SET_TYPE_FILTER:
			return {
				...state,
				type_filter: action.filter,
			};

		default:
			return state;
	}
}
