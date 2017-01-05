import {createStore, combineReducers, applyMiddleware} from 'redux'
import {redux_observer} from './core/redux-observer'
import {app_state} from './reducers'
import logger from 'redux-logger'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);
