import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';

import { VIEW_TYPES } from '../../constants';

import './ListItem.css';

const getThumbnail = data => {
	if ( data.media_details && data.media_details.sizes && data.media_details.sizes.thumbnail ) {
		return data.media_details.sizes.thumbnail.source_url;
	}

	return data.source_url;
}

export default function ListItem( props ) {
	const { data, view } = props;

	const thumbnail = getThumbnail( data );
	const classes = [
		'library-listitem',
		view === VIEW_TYPES.LIST ? 'library-listitem--in-list' : 'library-listitem--in-grid',
	];
	return (
		<li className={ classes.join( ' ' ) }>
			<Link to={ `/details/${ data.id }` }>
				<div className="library-listitem__thumbnail-wrap">
					<img
						alt={ data.title.rendered }
						className="library-listitem__thumbnail"
						src={ thumbnail }
					/>
				</div>
				{ view === VIEW_TYPES.LIST ? (
					<React.Fragment>
						<div className="library-listitem__details">
							<strong
								dangerouslySetInnerHTML={ { __html: data.title.rendered } }
							/>
							{ data.media_details.file && data.media_details.file.split( '/' ).slice( -1 )[0] }
						</div>
						<div className="library-listitem__date">
							<time
								dateTime={ data.date_gmt + 'Z' }
								title={ data.date_gmt + 'Z' }
							>
								<FormattedRelative value={ data.date_gmt + 'Z' } />
							</time>
						</div>
					</React.Fragment>
				) : null }
			</Link>
		</li>
	);
}
