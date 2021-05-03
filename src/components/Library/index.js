import { withArchive } from '@humanmade/repress';
import { Component } from '@wordpress/element';
import * as Luxon from 'luxon';
import queryString from 'query-string';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';
import { compose } from 'redux';

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

class Library extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			width: 820,
		};
	}

	onReceiveRef = el => {
		if ( ! el ) {
			return;
		}

		this.setState( {
			width: el.clientWidth,
		} );
	}

	onSubmit = e => {
		e.preventDefault();
	}

	onRefresh = () => {
		console.log( 'refresh' );
		console.log( this.props );
		this.props.onLoad();
	}

	render() {
		const { loading, posts, sort, view } = this.props;

		if ( loading ) {
			return (
				<div
					className="library library--grid"
					ref={ this.onReceiveRef }
				>
					<Header
						disabled={ true }
						sort={ sort }
						view={ view }
					/>

					<LibraryLoader
						width={ this.state.width }
					/>
				</div>
			);
		}

		if ( ! posts ) {
			return (
				<div
					className="library"
					ref={ this.onReceiveRef }
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
				ref={ this.onReceiveRef }
			>
				<Header
					sort={ sort }
					view={ view }
					onChangeView={ view => this.props.onSetView( view ) }
					onChangeSort={ this.props.onSetSort }
					onRefresh={ this.onRefresh }
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

export default compose(
	connect( mapStateToProps, mapDispatchToProps ),
	withArchive(
		media,
		state => state.media,
		props => {
			const args = buildMediaQuery( props );
			const id = 'index?' + queryString.stringify( args );
			media.registerArchive( id, args );
			return id;
		}
	),
)( Library );
