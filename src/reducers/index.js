import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import account from './account_Reducer';
import accountValidate from './accountValidate_Reducer'; 
import common from './commonReducer';
import merchant from './merchantReducer';
import deal from './dealReducer';
import admin from './adminReducer';
import ticket from './ticketReducer';
import userAccount from './userReducer';
import redeem from './redeemReducer';
import dashboard from './dashboardReducer';

const appReducer = combineReducers({
    account,
    accountValidate,
    common,
    merchant,
    deal,
    admin,
    ticket,
    userAccount,
    redeem,
    dashboard,
    form: formReducer,
});


const rootReducer = (state, action) => {

    if (action.type === 'LOGOUT') {
        state = undefined
    }
    
    return appReducer(state, action)
}


export default rootReducer;