import { Box, Center, Heading, Icon } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { Component, ErrorInfo, PropsWithChildren } from 'react';
import { Five0Five } from '../constants/images';

class ErrorBoundary extends Component<PropsWithChildren<any>, any> {
	constructor(props: PropsWithChildren<any>) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Center h="90vh">
					<Box textAlign="center">
						<Icon as={Five0Five} w="300px" h="180px" />
						<Heading fontSize="lg" fontWeight="normal">
							{__('Something went wrong', 'masteriyo')}
						</Heading>
					</Box>
				</Center>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
