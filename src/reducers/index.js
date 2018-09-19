import { combineReducers } from 'redux';

import library from './library';
import ui from './ui';
import { media, users } from '../types';

export default combineReducers( {
	library,
	media: media.reducer,
	ui,
	users: users.reducer,
} );
