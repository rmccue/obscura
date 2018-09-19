import React from 'react';

import Login from './Login';
import Logo from './Logo';

import './Welcome.css';

export default function Welcome( props ) {
	return (
		<div className="welcome">
			<div className="welcome__content">
				<Logo />
				<p>Welcome to Pressograph.</p>
				<p>Pressograph is a brand new media experience for WordPress. Manage your photos, video, and more in a purpose-built interface like no other.</p>
				<p>You're only a few steps away from using Pressograph. To get started, enter your WordPress site address.</p>

				<Login
					onSubmit={ props.onLogIn }
				/>
			</div>
		</div>
	);
}