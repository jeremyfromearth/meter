// vendor
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'

// application
import {redux_observer} from './core/redux-observer'
import * as Actions from './actions'
import {app_state} from './reducers'
import {MenuBarView} from './views'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);

new MenuBarView();

store.dispatch(Actions.open_file('[path to file]'));
