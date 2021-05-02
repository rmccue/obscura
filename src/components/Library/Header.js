import { Button } from '@wordpress/components';

import { SORT_TYPES, VIEW_TYPES } from '../../constants';

export default function Header( props ) {
	const { disabled, sort, view, onChangeSort, onChangeView, onRefresh } = props;

	return (
		<form
			className="library__view-options"
			onSubmit={ e => { e.preventDefault() } }
		>
			<div>
				<div class="view-switch">
					<label
						className={ view === VIEW_TYPES.GRID ? 'view-grid current' : 'view-grid' }
					>
						<input
							checked={ view === VIEW_TYPES.GRID }
							className="screen-reader-text"
							disabled={ disabled }
							name="view"
							type="radio"
							value={ VIEW_TYPES.GRID }
							onChange={ e => onChangeView( e.target.value ) }
						/>
						<span className="screen-reader-text">Grid</span>
					</label>
					<label
						className={ view === VIEW_TYPES.LIST ? 'view-list current' : 'view-list' }
					>
						<input
							checked={ view === VIEW_TYPES.LIST }
							className="screen-reader-text"
							disabled={ disabled }
							name="view"
							type="radio"
							value={ VIEW_TYPES.LIST }
							onChange={ e => onChangeView( e.target.value ) }
						/>
						<span className="screen-reader-text">List</span>
					</label>
				</div>
				<label>
					Sort by:
					<select
						disabled={ disabled }
						value={ sort }
						onChange={ e => onChangeSort( e.target.value ) }
					>
						<option default value={ SORT_TYPES.DATE }>Date (Newest to Oldest)</option>
						<option value={ SORT_TYPES.DATE_ASC }>Date (Oldest to Newest)</option>
						<option value={ SORT_TYPES.TITLE_ASC }>Name (Alphabetical)</option>
						<option value={ SORT_TYPES.TITLE }>Name (Reverse Alphabetical)</option>
						<option value={ SORT_TYPES.MODIFIED }>Last Modification (Newest to Oldest)</option>
						<option value={ SORT_TYPES.MODIFIED_ASC }>Last Modification (Oldest to Newest)</option>
					</select>
				</label>
			</div>

			<div>
				<Button
					disabled={ disabled }
					isSecondary
					onClick={ onRefresh }
				>
					Refresh
				</Button>
			</div>
		</form>
	);
}

Header.defaultProps = {
	disabled: false,
};
