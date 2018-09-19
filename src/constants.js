export const DATE_FILTER_TYPE = {
	RELATIVE: 'RELATIVE',
	ABSOLUTE: 'ABSOLUTE',
};

// Date ranges, in ISO8601 duration format
// https://en.wikipedia.org/wiki/ISO_8601#Durations
export const DATE_RANGES = {
	ALL: null,
	LAST_24_HOURS: 'PT24H',
	LAST_WEEK: 'P1W',
	LAST_MONTH: 'P1M',
};

export const SORT_TYPES = {
	DATE: 'DATE',
	DATE_ASC: 'DATE_ASC',
	TITLE: 'TITLE',
	TITLE_ASC: 'TITLE_ASC',
	MODIFIED: 'MODIFIED',
	MODIFIED_ASC: 'MODIFIED_ASC',
};

export const VIEW_TYPES = {
	GRID: 'GRID',
	LIST: 'LIST',
};
