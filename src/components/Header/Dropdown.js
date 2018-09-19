import React from 'react';

import './Dropdown.css';

export default class Dropdown extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			expanded: false,
		};
	}

	onToggle = () => {
		this.setState( state => ( { expanded: ! state.expanded } ) );
	}

	render() {
		const { children, className, flip, title } = this.props;
		const { expanded } = this.state;

		const classes = [
			'header-dropdown',
			expanded && 'header-dropdown--expanded',
			flip && 'header-dropdown--flip',
			className,
		];

		return <div className={ classes.filter( Boolean ).join( ' ' ) }>
			<button
				aria-expanded={ expanded }
				onClick={ this.onToggle }
				type="button"
			>
				{ title }
				<span className="header-dropdown__arrow">▼</span>
			</button>

			<ul className="header-dropdown__content">
				{ children }
			</ul>
		</div>;
	}
}

Dropdown.defaultProps = {
	className: '',
	flip: false,
};
