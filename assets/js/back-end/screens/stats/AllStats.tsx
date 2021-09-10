import {
	Container,
	Icon,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import queryString from 'query-string';
import React, { useState } from 'react';
import { BiBook, BiEdit } from 'react-icons/bi';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';
import useArray from '../../utils/useArray';
import Graphs from './Graphs';
import Logs from './Logs';

const AllStats = () => {
	const {
		array: logs,
		remove,
		push,
		set,
	} = useArray([
		{
			id: 1,
			type: 'error',
			title: 'Log 1',
			description: 'This is log description',
			user: {
				display_name: 'Krishna Suwal',
				avatar_url:
					'data:image/jpeg;base64,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',
			},
		},
	]);
	const history = useHistory();
	const { search } = useLocation();
	const { page } = queryString.parse(search);
	const [tabIndex, setTabIndex] = useState<number>(page === 'graphs' ? 1 : 0);

	const tabStyles = {
		fontWeight: 'medium',
		fontSize: 'sm',
		py: '6',
		px: 0,
		mx: 4,
		_hover: {
			color: 'blue.500',
		},
	};

	const tabPanelStyles = {
		px: '0',
	};

	const iconStyles = {
		mr: '2',
	};

	return (
		<Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
			<Stack direction="column" spacing="8" align="center">
				<Header>
					<TabList borderBottom="none" bg="white">
						<Tab
							sx={tabStyles}
							onClick={() => {
								history.push({
									pathname: routes.stats.index,
									search: '?page=logs',
								});
							}}>
							<Icon as={BiBook} sx={iconStyles} />
							{__('Logs', 'hrt')}
						</Tab>
						<Tab
							sx={tabStyles}
							onClick={() => {
								history.push({
									pathname: routes.stats.index,
									search: '?page=graphs',
								});
							}}>
							<Icon as={BiEdit} sx={iconStyles} />
							{__('Graphs', 'hrt')}
						</Tab>
					</TabList>
				</Header>
				<Container maxW="container.xl">
					<Stack direction="column" spacing="2">
						<TabPanels>
							<TabPanel sx={tabPanelStyles}>
								<Logs items={logs} onClickRemoveItem={() => {}} />
							</TabPanel>
							<TabPanel sx={tabPanelStyles}>
								<Graphs />
							</TabPanel>
						</TabPanels>
					</Stack>
				</Container>
			</Stack>
		</Tabs>
	);
};

export default AllStats;
