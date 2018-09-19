import React from 'react';

import './TextField.css';

export default function TextField( props ) {
	return (
		<input
			className="form-textfield"
			type="text"
			{ ...props }
		/>
	);
}
