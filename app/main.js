// vendor
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'

// application
import {redux_observer} from './core/redux-observer'
import * as Actions from './actions'
import {app_state} from './reducers'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);

store.dispatch(Actions.open_file('[path to file]'));
