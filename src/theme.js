import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

export let theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      main: '#00c853'
    }
  }
});
theme = responsiveFontSizes(theme);
