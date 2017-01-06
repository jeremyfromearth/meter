// vendor
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'
require('phosphor/styles/base.css')
require('./index.css');

// application
import {redux_observer} from './core/redux-observer'
import * as Actions from './actions'
import {app_state} from './reducers'
import {build_view} from './views'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);

build_view();


store.dispatch(Actions.open_file('[path to file]'));
