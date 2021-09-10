import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import HrtProvider from './context/HrtProvider';
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
				<HrtProvider>
					<QueryClientProvider client={queryClient}>
						<Router />
					</QueryClientProvider>
				</HrtProvider>
			</ErrorBoundary>
		</ChakraProvider>
	);
};

export default App;
