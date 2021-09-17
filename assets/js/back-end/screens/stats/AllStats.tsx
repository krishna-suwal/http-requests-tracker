import {
	Container,
	Heading,
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
import { BiBook, BiStats } from 'react-icons/bi';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';
import Logs from './Logs';
import Statistics from './Statistics';

const tabStyles = {
	fontWeight: 'medium',
	fontSize: 'sm',
	py: '6',
	px: 0,
	mx: 4,
};

const tabPanelStyles = {
	px: '0',
};

const iconStyles = {
	mr: '2',
};

const AllStats = () => {
	const history = useHistory();
	const { search } = useLocation();
	const { page } = queryString.parse(search);
	const [tabIndex, setTabIndex] = useState<number>(
		page === 'statistics' ? 1 : 0
	);

	return (
		<Tabs
			index={tabIndex}
			onChange={(index) => setTabIndex(index)}
			colorScheme="green">
			<Stack direction="column" align="center">
				<Header>
					<Stack direction="row" align="center" spacing="10">
						<Heading fontSize="md" fontWeight="bold" color="gray.500">
							{__('Stats', 'hrt')}
						</Heading>
						<TabList borderBottom="none">
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
										search: '?page=statistics',
									});
								}}>
								<Icon as={BiStats} sx={iconStyles} />
								{__('Statistics', 'hrt')}
							</Tab>
						</TabList>
					</Stack>
				</Header>
				<Container maxW="container.xl">
					<TabPanels>
						<TabPanel sx={tabPanelStyles}>
							<Logs />
						</TabPanel>
						<TabPanel sx={tabPanelStyles}>
							<Statistics />
						</TabPanel>
					</TabPanels>
				</Container>
			</Stack>
		</Tabs>
	);
};

export default AllStats;
