import React from 'react';
import { connect } from 'react-redux';

import DateFilter from './DateFilter';
import OptionList from './OptionList';
import Section from './Section';
import {
	setDateFilterDuration,
	setDateFilterRange,
	setTypeFilter,
} from '../../actions';
import { DATE_FILTER_TYPE, DATE_RANGES } from '../../constants';

import './index.css';

const DATE_RANGE_OPTIONS = [
	{
		title: 'All',
		value: DATE_RANGES.ALL,
	},
	{
		title: 'In the last 24 hours',
		value: DATE_RANGES.LAST_24_HOURS,
	},
	{
		title: 'In the last week',
		value: DATE_RANGES.LAST_WEEK,
	},
	{
		title: 'In the last month',
		value: DATE_RANGES.LAST_MONTH,
	},
];

const TYPE_OPTIONS = [
	{
		title: 'Any',
		value: null,
	},
	{
		title: 'Image',
		value: 'image',
	},
	{
		title: 'Video',
		value: 'video',
	},
	{
		title: 'Audio',
		value: 'audio',
	},
	{
		title: 'Other',
		value: 'application',
	},
];

class Sidebar extends React.Component {
	onSelectAbsolute = () => {
		if ( ! this.dateFilter ) {
			return;
		}

		this.props.onChangeDateFilterRange( null, null );
		this.dateFilter.focus();
	}

	render() {
		return (
			<div className="sidebar">
				<Section title="Type">
					<OptionList
						options={ TYPE_OPTIONS }
						value={ this.props.type_filter }
						onChange={ this.props.onChangeTypeFilter }
					/>
				</Section>
				<Section title="Date Range">
					<OptionList
						options={ DATE_RANGE_OPTIONS }
						value={ this.props.date_filter.type === DATE_FILTER_TYPE.RELATIVE && this.props.date_filter.duration }
						onChange={ this.props.onChangeDateFilterDuration }
					/>

					<label>
						<input
							checked={ this.props.date_filter.type === DATE_FILTER_TYPE.ABSOLUTE }
							type="radio"
							value={ DATE_FILTER_TYPE.ABSOLUTE }
							onChange={ this.onSelectAbsolute }
						/>

						Custom: <br />
						<DateFilter
							ref={ ref => this.dateFilter = ref }
							value={ this.props.date_filter }
							onChange={ this.props.onChangeDateFilterRange }
						/>
					</label>
				</Section>
			</div>
		);
	}
}

const mapStateToProps = state => ( {
	date_filter: state.library.date_filter,
	type_filter: state.library.type_filter,
} );

const mapDispatchToProps = dispatch => ( {
	onChangeDateFilterDuration: duration => dispatch( setDateFilterDuration( duration ) ),
	onChangeDateFilterRange: ( start, end ) => dispatch( setDateFilterRange( start, end ) ),
	onChangeTypeFilter: value => dispatch( setTypeFilter( value ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
