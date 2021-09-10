export const infoIconStyles = {
	d: 'inline-flex',
	alignItems: 'center',
	ml: '2',
	color: 'gray.400',
};

export const tableStyles = {
	th: {
		pb: '6',
		borderBottom: 'none',
	},
	'tr:nth-of-type(2n+1) td': {
		bg: '#f8f9fa',
	},

	tr: {
		'th, td': {
			':first-of-type': {
				pl: '12',
			},
			':last-child': {
				pr: '6',
			},
		},
	},
	td: {
		py: '3',
		borderBottom: 'none',
	},
};
