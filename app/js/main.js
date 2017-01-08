// vendor
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'

require('phosphor/styles/base.css')
require('../styles/index.css');
require('../styles/font-awesome.min.css');

// application
import {redux_observer} from './redux-observer'
import * as Actions from './actions'
import {app_state} from './reducers'
import {build_view} from './view'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);

build_view();


store.dispatch(Actions.open_file('[path to file]'));
