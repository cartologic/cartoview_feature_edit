import {
	cyan900,
	blue500,
	blue600,
	indigo400,
	indigo500,
	teal500,
	darkBlack,
	white,
	grey300,
	cyan500,
	blueGrey400
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import zIndex from 'material-ui/styles/zIndex';
import spacing from 'material-ui/styles/spacing';

export default {
	grey : {
		spacing: spacing,
		zIndex: zIndex,
		fontFamily: 'Roboto, sans-serif',
		palette: {
			primary1Color: blueGrey400,
			primary2Color: blueGrey400,
			textColor: darkBlack,
			alternateTextColor: white,
			borderColor: grey300,
			disabledColor: fade( darkBlack, 0.3 ),
			pickerHeaderColor: blueGrey400
		}
	},
	blue : {

		spacing: spacing,
		zIndex: zIndex,
		fontFamily: 'Roboto, sans-serif',
		palette: {
			primary1Color: blue500,
			primary2Color: blue600,
			textColor: darkBlack,
			alternateTextColor: white,
			borderColor: grey300,
			disabledColor: fade( darkBlack, 0.3 ),
			pickerHeaderColor: blue500
		}

	},
	teal : {

		spacing: spacing,
		zIndex: zIndex,
		fontFamily: 'Roboto, sans-serif',
		palette: {
			primary1Color: teal500,
			primary2Color: cyan900,
			textColor: darkBlack,
			alternateTextColor: white,
			borderColor: grey300,
			disabledColor: fade( darkBlack, 0.3 ),
			pickerHeaderColor: cyan500
		}

	},
	indigo : {
		spacing: spacing,
		zIndex: zIndex,
		fontFamily: 'Roboto, sans-serif',
		palette: {
			primary1Color: indigo400,
			primary2Color: indigo500,
			textColor: darkBlack,
			alternateTextColor: white,
			borderColor: grey300,
			disabledColor: fade( darkBlack, 0.3 ),
			pickerHeaderColor: indigo400
		}

	}

};
