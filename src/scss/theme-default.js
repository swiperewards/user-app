import getMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {grey900, blue600, white} from '@material-ui/core/colors';

const themeDefault = getMuiTheme({
  palette: {
    primary: {
      light: '#2196F3',
      main: '#2196F3',
      dark: '#2196F3',
      contrastText: '#fff',
    },
  },
  appBar: {
    height: 57,
    color: blue600,
  },
  drawer: {
    width: 230,
    color: grey900,
  },
  Button: {
    primaryColor: blue600,
    color: white,
  },
  stepper: {
    iconColor: 'rgb(38, 165, 238)',
  },
  fontFamily: 'Montserrat, sans-serif',
  
});


export default themeDefault;