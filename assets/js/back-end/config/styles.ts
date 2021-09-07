import theme from '../theme/theme';

export const borderedBoxStyles = {
	border: '1px',
	borderColor: 'gray.100',
	rounded: 'sm',
	mb: '4',
	alignItems: 'center',
	justify: 'space-between',
	px: '2',
	py: '1',
};

export const sectionHeaderStyles = {
	alignItems: 'center',
	justifyContent: 'space-between',
	borderBottom: '1px',
	borderColor: 'gray.100',
	pb: '3',
};

export const infoIconStyles = {
	d: 'inline-flex',
	alignItems: 'center',
	ml: '2',
	color: 'gray.400',
};

export const reactSelectStyles = {
	control: (provided: any, state: any) => ({
		...provided,
		minHeight: '40px',
		boxShadow: theme.shadows.input,
		borderRadius: theme.radii.sm,
		borderColor: state.isDisabled
			? theme.colors.gray[200]
			: state.isFocused
			? theme.colors.blue
			: 'inherit',
		transition: 'all 0.35s ease-in-out',
		backgroundColor: theme.colors.white,
		opacity: state.isDisabled ? '0.4' : '1',
		cursor: state.isDisabled ? 'not-allowed' : 'inherit',
		fontSize: theme.fontSizes.sm,

		'&:hover': {
			borderColor: theme.colors.gray[300],
		},
	}),

	placeholder: (provided: any) => ({
		...provided,
		color: theme.colors.gray[300],
		marginLeft: 0,
	}),

	indicatorSeparator: (provided: any) => ({
		...provided,
		backgroundColor: theme.colors.gray[100],
	}),

	dropdownIndicator: (provided: any) => ({
		...provided,
		color: theme.colors.gray[300],
	}),

	option: (provided: any, state: any) => ({
		...provided,
		backgroundColor: state.isSelected
			? theme.colors.blue[300]
			: state.isFocused
			? theme.colors.blue[10]
			: 'transparent',
	}),

	multiValue: (provided: any) => ({
		...provided,
		backgroundColor: theme.colors.blue[50],
	}),

	menu: (provided: any) => ({
		...provided,
		borderRadius: theme.radii.sm,
		zIndex: '3',
		fontSize: theme.fontSizes.xs,
	}),
};

export const whileDraggingStyles = {
	bg: '#f8f8f8',
	border: '1px dashed',
	borderColor: 'gray.200',
	borderRadius: 'sm',
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

export const navLinkStyles = {
	mr: '10',
	py: '6',
	d: 'flex',
	alignItems: 'center',
	fontWeight: 'medium',
	fontSize: 'sm',
};

export const navActiveStyles = {
	borderBottom: '2px',
	borderColor: 'blue.500',
	color: 'blue.500',
};
