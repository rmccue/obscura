import React from 'react';

import './Button.css';

export default function Button( props ) {
	return (
		<button
			className={ `button ${ props.className || '' }` }
			disabled={ props.disabled || false }
			type={ props.submit ? 'submit' : 'button' }
			onClick={ props.onClick || null }
		>
			{ props.children }
		</button>
	);
}
