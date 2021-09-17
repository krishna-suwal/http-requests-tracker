import { Skeleton, SkeletonText, Stack, Td, Tr } from '@chakra-ui/react';
import React from 'react';

export const SkeletonLogsList: React.FC = () => {
	const lengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	return (
		<>
			{lengths.map((index) => (
				<Tr key={index}>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
				</Tr>
			))}
		</>
	);
};

export const SkeletonStatistics: React.FC = () => {
	return (
		<>
			{[1, 2, 3].map((index) => (
				<Tr key={index}>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
					<Td>
						<SkeletonText noOfLines={1} />
					</Td>
				</Tr>
			))}
		</>
	);
};

export const SkeletonSettings: React.FC = () => {
	return (
		<Stack spacing="4" w="full">
			<Skeleton h="6" w="full" />
			<Skeleton h="6" w="full" />
		</Stack>
	);
};
