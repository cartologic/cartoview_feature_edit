import {cyan900,lightBlueA400,darkBlack,white,grey300,cyan500 } from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import zIndex from 'material-ui/styles/zIndex';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing: spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: lightBlueA400,
    primary2Color: cyan900,
    textColor: darkBlack,
    alternateTextColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
  }
};
