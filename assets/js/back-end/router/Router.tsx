import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import routes from '../constants/routes';
import * as screens from '../screens';

const Router: React.FC = () => {
	return (
		<HashRouter>
			<Switch>
				<Route path={routes.settings} exact>
					<screens.Settings />
				</Route>
				<Route path={routes.stats.index} exact>
					<screens.AllStats />
				</Route>
				<Route path={routes.urlSchemes.list}>
					<screens.AllUrlSchemes />
				</Route>
				<Route>
					<screens.FourOFour />
				</Route>
			</Switch>
		</HashRouter>
	);
};

export default Router;
