import { decodeEntity } from '../../utils/utils';

//@ts-ignore
const currencyPosition = window._MASTERIYO_.currency.position;

const PriceWithSymbol = (price: string | number, currencySymbol: string) => {
	let FormattedPriceWithSymbol: string;

	switch (currencyPosition) {
		case 'left':
			FormattedPriceWithSymbol = `${decodeEntity(currencySymbol)}${price}`;
			break;

		case 'right':
			FormattedPriceWithSymbol = `${price}${decodeEntity(currencySymbol)}`;
			break;

		case 'left_space':
			FormattedPriceWithSymbol = `${decodeEntity(currencySymbol)} ${price}`;
			break;

		case 'right_space':
			FormattedPriceWithSymbol = `${price} ${decodeEntity(currencySymbol)}`;
			break;
		default:
			// default set to left.
			FormattedPriceWithSymbol = `${decodeEntity(currencySymbol)}${price}`;
	}

	return FormattedPriceWithSymbol;
};

export default PriceWithSymbol;
