import { withSingle } from '@humanmade/repress';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Dropdown from './Dropdown';
import { users } from '../../types';

import './User.css';

function User( props ) {
	const { loading, user } = props;

	if ( loading ) {
		return (
			<span className="header-user">
				Loading user data…
			</span>
		);
		}
	if ( ! user ) {
		return (
			<span className="header-user">
				Could not load user details
			</span>
		);
	}

	const title = (
		<React.Fragment>
			<img
				alt=""
				className="header-user__avatar"
				src={ user.avatar_urls[48] }
			/>
			{ user.name }
		</React.Fragment>
	);

	return (
		<Dropdown
			className="header-user"
			flip
			title={ title }
		>
			<li>
				<button
					onClick={ props.onLogOut }
					type="button"
				>
					Log Out
				</button>
			</li>
		</Dropdown>
	);
}


const mapStateToProps = state => ( {
	user: state.ui.user,
} );

export default compose(
	connect( mapStateToProps ),
	withSingle(
		users,
		state => state.users,
		props => props.user,
		{
			mapDataToProps: data => ( {
				loading: data.loading,
				user: data.post,
			} ),
		}
	)
)( User );
