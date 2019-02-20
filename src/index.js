import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from './store/store';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import defaultTheme from './scss/theme-default'
import '../src/scss/styles.css'
import 'flexboxgrid/css/flexboxgrid.css';

ReactDOM.render(
    <Provider store={Store}>
        <MuiThemeProvider theme={defaultTheme}>    
            <Routes />
        </MuiThemeProvider>
    </Provider>, 
document.getElementById('root'));

registerServiceWorker();