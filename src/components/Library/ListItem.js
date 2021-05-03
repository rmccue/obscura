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

	/*
	<li
		tabindex="0"
		role="checkbox"
		aria-label="screen-options-demo" aria-checked="false" data-id="12406" class="attachment save-ready">
		<div class="attachment-preview js--select-attachment type-image subtype-gif landscape">
			<div class="thumbnail">

					<div class="centered">
						<img src="https://hmn.md/uploads/2018/09/screen-options-demo-300x154.gif" draggable="false" alt="">
					</div>

			</div>

		</div>

			<button type="button" class="check" tabindex="-1"><span class="media-modal-icon"></span><span class="screen-reader-text">Deselect</span></button>


	</li>
	*/

	/*
	<tr id="post-390" class="author-self status-inherit">
		<th scope="row" class="check-column">
			<label class="screen-reader-text" for="cb-select-390">Select Yeezy</label>
			<input name="media[]" id="cb-select-390" value="390" type="checkbox">
		</th>
		<td class="title column-title has-row-actions column-primary" data-colname="File">
			<strong class="has-media-icon">
				<a href="https://journal.rmccue.io/wp/wp-admin/post.php?post=390&amp;action=edit" aria-label="“Yeezy” (Edit)">				<span class="media-icon image-icon"><img src="https://rmccue.io/uploads/2018/09/yeezy-150x150.jpg" class="attachment-60x60 size-60x60" alt="" scale="0" width="60" height="60"></span>
					Yeezy
				</a>
			</strong>
			<p class="filename">
				<span class="screen-reader-text">File name: </span>
				yeezy.jpg
			</p>
			<div class="row-actions">
				<span class="edit">
					<a href="https://journal.rmccue.io/wp/wp-admin/post.php?post=390&amp;action=edit" aria-label="Edit “Yeezy”">Edit</a> | </span>
					<span class="delete"><a href="post.php?action=delete&amp;post=390&amp;_wpnonce=2e30c181a6" class="submitdelete aria-button-if-js" onclick="return showNotice.warn();" aria-label="Delete “Yeezy” permanently" role="button">Delete Permanently</a> | </span>
					<span class="view"><a href="https://journal.rmccue.io/yeezy/" aria-label="View “Yeezy”" rel="bookmark">View</a></span>
			</div>
			<button type="button" class="toggle-row"><span class="screen-reader-text">Show more details</span></button>
		</td>
		<td class="author column-author" data-colname="Author">
			<a href="upload.php?author=1">rmccue</a>
		</td>
		<td class="parent column-parent" data-colname="Uploaded to">(Unattached)			<br>
			<a href="#the-list" onclick="findPosts.open( 'media[]', '390' ); return false;" class="hide-if-no-js aria-button-if-js" aria-label="Attach “Yeezy” to existing content" role="button">Attach</a>
		</td>
		<td class="comments column-comments" data-colname="Comments">
			<div class="post-com-count-wrapper">
				<span aria-hidden="true">—</span>
				<span class="screen-reader-text">No comments</span>
				<span class="post-com-count post-com-count-pending post-com-count-no-pending">
					<span class="comment-count comment-count-no-pending" aria-hidden="true">0</span>
					<span class="screen-reader-text">No comments</span>
				</span>
			</div>
		</td>
		<td class="date column-date" data-colname="Date">12 mins ago</td>
	</tr>
	*/
}
