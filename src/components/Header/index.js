import { Link, Route, Switch } from 'react-router-dom';

import Uploader from '../Uploader';

import './index.css';

export default function Header( props ) {
	return (
		<header className="header">
			<div className="header__primary">
				<h1>Media</h1>
			</div>
			<div className="header__secondary">
				<Switch>
					<Route exact path="/">
						<Uploader
							files={ props.uploading }
							onUpload={ props.onUpload }
						/>
					</Route>
					<Route>
						<Link to="/">
							Back to Library
						</Link>
					</Route>
				</Switch>
			</div>
		</header>
	);
}
