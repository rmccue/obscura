import './OptionList.css';

const Option = props => {
	return (
		<li>
			<label>
				<input
					checked={ props.active }
					type={ props.multiple ? 'checkbox' : 'radio' }
					value={ props.value || '' }
					onChange={ e => props.onChange( props.value, e.target.checked ) }
				/>

				{ props.title }
			</label>
		</li>
	);
}

export default function OptionList( props ) {
	const { multiple, options, value } = props;

	const onChange = ( item, active ) => {
		if ( ! multiple ) {
			return props.onChange( item );
		}

		if ( ! active && value.indexOf( item ) >= 0 ) {
			const nextValue = value.filter( i => i !== item );
			props.onChange( nextValue );
		} else if ( value.indexOf( item ) === -1 ) {
			const nextValue = [ ...value, item ];
			props.onChange( nextValue );
		}
	};

	return (
		<ul className="sidebar-optionlist">
			{ options.map( option => (
				<Option
					key={ option.value }
					active={ multiple ? value.indexOf( option.value ) >= 0 : option.value === value }
					multiple={ multiple }
					title={ option.title }
					value={ option.value }
					onChange={ onChange }
				/>
			) ) }
		</ul>
	);
}

OptionList.defaultProps = {
	multiple: false,
};
