import { useArchive } from '@humanmade/repress';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import * as Luxon from 'luxon';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';

import Header from './Header';
import ListItem from './ListItem';
import { setLibraryView, setSort } from '../../actions';
import { DATE_FILTER_TYPE, SORT_TYPES, VIEW_TYPES } from '../../constants';
import { media } from '../../types';

import './index.css';

const buildMediaQuery = props => {
	const args = {};
	if ( props.type_filter ) {
		args.media_type = props.type_filter;
	}
	switch ( props.sort ) {
		case SORT_TYPES.TITLE_ASC:
			args.order = 'asc';
			// Fallthrough.

		case SORT_TYPES.TITLE:
			args.orderby = 'title';
			break;

		case SORT_TYPES.MODIFIED_ASC:
			args.order = 'asc';
			// Fallthrough.

		case SORT_TYPES.MODIFIED:
			args.orderby = 'modified';
			break;

		case SORT_TYPES.DATE_ASC:
			args.order = 'asc';
			// Fallthrough.

		case SORT_TYPES.DATE:
		default:
			// Default, skip.
			break;
	}

	const ref_time = Luxon.DateTime.local().startOf( 'hour' );
	switch ( props.date_filter.type ) {
		case DATE_FILTER_TYPE.ABSOLUTE:
			if ( props.date_filter.start && props.date_filter.end ) {
				args.after = props.date_filter.start.toISOString();
				args.before = props.date_filter.end.toISOString();
			}
			break;

		case DATE_FILTER_TYPE.RELATIVE:
		default:
			if ( props.date_filter.duration ) {
				const duration = Luxon.Duration.fromISO( props.date_filter.duration );
				const start = ref_time.minus( duration );
				args.after = start.toISO();
			}
			break;
	}

	return args;
};

const LibraryLoader = props => {
	const items = 7;
	const padding = 6.4;
	const itemHeight = 150;
	const itemWidth = 150;

	const maxPerRow = Math.floor( props.width / ( itemWidth + padding * 2 ) );

	return (
		<ContentLoader
			className="library__loader"
			height={ Math.ceil( items / maxPerRow ) * ( itemWidth + padding * 2 ) }
			width={ props.width }
		>
			{ Array( items ).fill().map( ( _, i ) => (
				<rect
					key={ i }
					x={ padding + ( i % maxPerRow ) * ( itemWidth + padding * 2 ) }
					y={ padding + Math.floor( i / maxPerRow ) * ( itemHeight + padding * 2 ) }
					width={ itemWidth }
					height={ itemHeight }
				/>
			) ) }
		</ContentLoader>
	);
}

export function Library( props ) {
	const [ width, setWidth ] = useState( 820 );

	const onReceiveRef = el => {
		if ( ! el ) {
			return;
		}

		setWidth( el.clientWidth );
	}

	const archiveId = () => {
		const args = buildMediaQuery( props );
		const id = addQueryArgs( 'index', args );
		media.registerArchive( id, args );
		return id;
	};

	const { load, loading, posts } = useArchive(
		media,
		state => state.media,
		archiveId()
	);
	const { sort, view } = props;

	if ( loading ) {
		return (
			<div
				className="library library--grid"
				ref={ onReceiveRef }
			>
				<Header
					disabled={ true }
					sort={ sort }
					view={ view }
				/>

				<LibraryLoader
					width={ width }
				/>
			</div>
		);
	}

	if ( ! posts ) {
		return (
			<div
				className="library"
				ref={ onReceiveRef }
			>
				<p>Unable to load media.</p>
			</div>
		);
	}

	const classes = [
		'library',
		view === VIEW_TYPES.GRID ? 'library--grid' : 'library--list',
	];
	return (
		<div
			className={ classes.join( ' ' ) }
			ref={ onReceiveRef }
		>
			<Header
				sort={ sort }
				view={ view }
				onChangeView={ view => props.onSetView( view ) }
				onChangeSort={ props.onSetSort }
				onRefresh={ load }
			/>

			<ul className="library__item-list">
				{ posts.map( post => (
					<ListItem
						key={ post.id }
						data={ post }
						view={ view }
					/>
				) ) }
				{ posts.length === 0 ? (
					<li className="library__no-results">No results</li>
				) : null }
			</ul>
		</div>
	);
}

const mapStateToProps = state => ( {
	date_filter: state.library.date_filter,
	sort: state.library.sort,
	type_filter: state.library.type_filter,
	view: state.library.view,
} );
const mapDispatchToProps = dispatch => ( {
	onSetSort: sort => dispatch( setSort( sort ) ),
	onSetView: view => dispatch( setLibraryView( view ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Library );
