import { SlotFillProvider } from '@wordpress/components';
import { render } from '@wordpress/element';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

import 'react-dates/initialize';
import './index.css';

const store = createStore(
	reducers,
	{},
	composeWithDevTools(
		applyMiddleware( thunk )
	)
);

const renderApp = App => render(
	<Provider store={ store }>
		<SlotFillProvider>
			<IntlProvider locale="en">
				<Router>
					<App />
				</Router>
			</IntlProvider>
		</SlotFillProvider>
	</Provider>,
	document.getElementById( 'obscura-root' )
);

renderApp( App );

if ( module.hot ) {
	module.hot.accept( './components/App', () => import( './components/App' ).then( m => {
		const App = m.default;
		render( App )
	} ) );
}
