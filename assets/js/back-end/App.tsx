import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CreateCatModalProvider from './context/CreateCatProvider';
import MasteriyoProvider from './context/MasteriyoProvider';
import ErrorBoundary from './errors/ErrorBoundary';
import Router from './router/Router';
import theme from './theme/theme';

const App = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
				useErrorBoundary: true,
			},
		},
	});

	return (
		<ChakraProvider theme={theme}>
			<ErrorBoundary>
				<MasteriyoProvider>
					<QueryClientProvider client={queryClient}>
						<CreateCatModalProvider>
							<Router />
						</CreateCatModalProvider>
					</QueryClientProvider>
				</MasteriyoProvider>
			</ErrorBoundary>
		</ChakraProvider>
	);
};

export default App;
