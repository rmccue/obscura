import { Panel, PanelBody } from '@wordpress/components';

import { connect } from 'react-redux';

import DateFilter from './DateFilter';
import OptionList from './OptionList';
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
			<Panel className="sidebar">
				<PanelBody title="Type">
					<OptionList
						options={ TYPE_OPTIONS }
						value={ this.props.type_filter }
						onChange={ this.props.onChangeTypeFilter }
					/>
				</PanelBody>
				<PanelBody title="Date Range">
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
				</PanelBody>
			</Panel>
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
