import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import User from './User';
import Logo from '../Logo';
import Uploader from '../Uploader';

import './index.css';

export default function Header( props ) {
	return (
		<header className="header">
			<div className="header__primary">
				<Logo />

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

			<User
				onLogOut={ props.onLogOut }
			/>
		</header>
	);
}
