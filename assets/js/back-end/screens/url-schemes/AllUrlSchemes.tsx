import { nanoid } from 'nanoid';
import React from 'react';
import { useQuery } from 'react-query';
import { HashRouter, Route, Switch, useHistory } from 'react-router-dom';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import { useSaver } from '../../hooks/saving-signals';
import { SetttingsMap, UrlSchemeType } from '../../types';
import API from '../../utils/api';
import { removeArrayItemObjBy, updateArrayItemObj } from '../../utils/array';
import { cache } from '../../utils/cache';
import useArray from '../../utils/useArray';
import AddNewUrlScheme from './AddNewUrlScheme';
import EditUrlScheme from './EditUrlScheme';
import UrlSchemesList from './UrlSchemesList';

const getNewUrlScheme = (data: any) => ({
	...data,
	id: nanoid(),
	author: {
		id: 1,
	},
});

const AllUrlSchemes = () => {
	const { array: urlSchemes, set } = useArray(cache.get('url-schemes', []));
	const history = useHistory();
	const { save } = useSaver('settings');
	const settingsApi = new API(urls.settings);
	const settingsQuery = useQuery<SetttingsMap>(
		'settings',
		() => settingsApi.list(),
		{
			onSuccess: function (data) {
				set(data['url_schemes.list']);
				cache.set('url-schemes', data['url_schemes.list']);
			},
		}
	);

	const onSubmitNewUrlScheme = (data: UrlSchemeType) => {
		const newList = [getNewUrlScheme(data), ...urlSchemes];

		set(newList);
		save({
			'url_schemes.list': newList,
		});
		cache.set('url-schemes', newList);
		history.push({
			pathname: routes.urlSchemes.list,
		});
	};
	const onChangeEnable = (id: string, isChecked: boolean) => {
		const newUrlSchemes = updateArrayItemObj(
			'id',
			id,
			{
				enable: isChecked,
			},
			urlSchemes
		);

		save({
			'url_schemes.list': newUrlSchemes,
		});
		set(newUrlSchemes);
		cache.set('url-schemes', newUrlSchemes);
	};
	const onUpdateUrlScheme = (data: UrlSchemeType) => {
		const newUrlSchemes = updateArrayItemObj('id', data.id, data, urlSchemes);

		history.push({
			pathname: routes.urlSchemes.list,
		});
		save({
			'url_schemes.list': newUrlSchemes,
		});
		set(newUrlSchemes);
		cache.set('url-schemes', newUrlSchemes);
	};
	const onRemoveItem = (id: number) => {
		const newUrlSchemes = removeArrayItemObjBy('id', id, urlSchemes);

		save({
			'url_schemes.list': newUrlSchemes,
		});
		set(newUrlSchemes);
		cache.set('url-schemes', newUrlSchemes);
	};

	if (settingsQuery.isLoading) {
		return <FullScreenLoader />;
	}

	return (
		<HashRouter>
			<Switch>
				<Route path={routes.urlSchemes.add} exact>
					<AddNewUrlScheme onSubmit={onSubmitNewUrlScheme} />
				</Route>
				<Route path={routes.urlSchemes.edit} exact>
					<EditUrlScheme list={urlSchemes} onSubmit={onUpdateUrlScheme} />
				</Route>
				<Route>
					<UrlSchemesList
						items={urlSchemes}
						onClickRemoveItem={onRemoveItem}
						onChangeEnable={onChangeEnable}
					/>
				</Route>
			</Switch>
		</HashRouter>
	);
};

export default AllUrlSchemes;
