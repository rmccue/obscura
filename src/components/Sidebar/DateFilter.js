import moment from 'moment';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import { START_DATE } from 'react-dates/constants';

import { DATE_FILTER_TYPE } from '../../constants';

import 'react-dates/lib/css/_datepicker.css';

export default class DateFilter extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			focusedInput: null,
			dates: null,
		};
		this.now = moment();

		if ( props.value && props.value.type === DATE_FILTER_TYPE.ABSOLUTE ) {
			this.state.dates = {
				startDate: props.value.start,
				endDate: props.value.end,
			};
		}
	}
	// Only allow past dates.
	isOutsideRange = day => {
		return ! isInclusivelyBeforeDay( day, this.now );
	}

	focus() {
		this.setState( { focusedInput: START_DATE } );
	}

	onDatesChange = dates => {
		console.log( dates );
		this.setState( { dates } );
		if ( dates.startDate && dates.endDate ) {
			this.props.onChange( dates.startDate, dates.endDate );
		}
	}

	onFocusChange = focusedInput => {
		console.log( focusedInput );
		this.setState( { focusedInput } );
		if ( focusedInput && this.props.onFocus ) {
			this.props.onFocus();
		}
	}

	render() {
		const dateProps = {
			...this.state.dates,
			startDateId: 'date_filter_start',
			endDateId: 'date_filter_end',
		};

		return (
			<DateRangePicker
				{ ...dateProps }
				isOutsideRange={ this.isOutsideRange }
				focusedInput={ this.state.focusedInput }
				small
				// withPortal
				onDatesChange={ this.onDatesChange }
				onFocusChange={ this.onFocusChange }
			/>
		);
	}
}
