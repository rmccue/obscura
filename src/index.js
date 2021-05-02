import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';

import 'react-dates/initialize';
import './index.css';

const store = createStore(
	reducers,
	{},
	composeWithDevTools(
		applyMiddleware( thunk )
	)
);

const render = App => ReactDOM.render(
	<Provider store={ store }>
		<IntlProvider locale="en">
			<Router>
				<App />
			</Router>
		</IntlProvider>
	</Provider>,
	document.getElementById( 'obscura-root' )
);

render( App );
registerServiceWorker();

if ( module.hot ) {
	module.hot.accept( './components/App', () => import( './components/App' ).then( m => {
		const App = m.default;
		render( App )
	} ) );
}
