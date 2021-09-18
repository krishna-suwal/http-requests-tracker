import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	config: {
		initialColorMode: 'light',
		useSystemColorMode: false,
	},
	styles: {
		global: {
			'.wp-admin #hrt-backend': {
				ml: '-20px',
			},
			'::placeholder': {
				fontSize: 'sm',
			},
		},
	},
	shadows: {
		box: '0px 0px 60px rgba(0, 0, 0, 0.08)',
		input: '0px 1px 0px #EFF0F6',
		button: '0px 4px 14px rgba(0, 0, 0, 0.13)',
		boxl: '0px 0px 60px rgba(0, 0, 0, 0.15)',
		header: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
	},

	components: {
		Popover: {
			baseStyle: {
				popper: {
					width: 'fit-content',
					maxWidth: 'fit-content',
				},
			},
		},
		Button: {
			baseStyle: {
				borderRadius: 'none',
			},
			sizes: {
				md: {
					fontSize: 'xs',
				},
				sm: {
					fontSize: 'xs',
				},
			},
			variants: {
				solid: {
					shadow: 'button',
				},
			},
		},
		Input: {
			sizes: {
				md: {
					field: {
						borderRadius: 'sm',
						shadow: 'input',
					},
				},
			},

			variants: {
				outline: {
					addon: {
						bg: '#f8f8f8',
						borderRadius: 'sm',
						fontSize: 'sm',
					},
				},
			},

			defaultProps: {
				_placeholder: {
					color: 'red',
				},
			},
		},
		Textarea: {
			sizes: {
				md: {
					borderRadius: 'sm',
					shadow: 'input',
				},
			},
		},
		FormLabel: {
			baseStyle: {
				fontSize: 'sm',
				fontWeight: 'semibold',
				mb: '3',
			},
		},
		Select: {
			sizes: {
				md: {
					field: {
						borderRadius: 'sm',
						shadow: 'input',
					},
				},
			},
		},

		Modal: {
			sizes: {
				fullSpacing: {
					dialog: {
						w: '100%',
						maxW: '800px',
						minH: '400px',
						maxH: 'calc(100vh - 80px)',
					},
				},
			},
		},

		Radio: {
			sizes: {
				md: {
					label: {
						fontSize: 'sm',
					},
				},
			},
		},
	},
});

export default theme;
