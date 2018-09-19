import React from 'react';

import './Section.css';

export default function Section( props ) {
	return (
		<div className="sidebar-section">
			<p className="sidebar-section__title">{ props.title }</p>
			{ props.children }
		</div>
	);
}
