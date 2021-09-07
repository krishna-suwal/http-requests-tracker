import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import routes from '../constants/routes';
import * as screens from '../screens';

const Router: React.FC = () => {
	return (
		<HashRouter>
			<Switch>
				<Route path={routes.stats} exact>
					<screens.AllCourses />
				</Route>
				<Route path={routes.urlSchemes} exact>
					<screens.AllCourses />
				</Route>
				<Route path={routes.settings} exact>
					<screens.Settings />
				</Route>
				<Route>
					<screens.FourOFour />
				</Route>
			</Switch>
		</HashRouter>
	);
};

export default Router;
