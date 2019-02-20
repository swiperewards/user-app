import {createStore,applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';

// REDUCERS
import reducers from '../reducers';
import { LoadState, SaveState } from './localStorage'
import { authentocationMiddleware } from '../components/authentication'

const persistedState = LoadState();

const store = createStore(
    reducers,
    persistedState,
    applyMiddleware(promiseMiddleware, authentocationMiddleware)
)

store.subscribe(() => {
    
    var user = store.getState().accountValidate.user;
    if (user) {
        if (user.status === 200 || user.status === 802) {
            var accountData = {
                accountValidate: store.getState().accountValidate
            }
            SaveState(accountData)
        }
    }
})

export default store;
