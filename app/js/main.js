// css
require('phosphor/styles/base.css')
require('../styles/index.css');
require('../styles/font-awesome.min.css');

// vendor
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'

// application
import * as BootstrapActions from './actions/bootstrap-actions'
import {View} from './view/view'
import {app_state} from './reducers/app-state'
import {redux_observer} from './core/redux-observer'

const store = createStore(
    combineReducers({
        app_state 
    }), 
    applyMiddleware(logger(), 
    redux_observer)
);

//new View(store.dispatch);
//store.dispatch(BootstrapActions.bootstrap());

import {Subject} from 'rxjs/Subject'
const action = new Subject();
const state = {location: 'home'};
const reducer = (state, action) => {
    switch(action.type) {
        case 'LOC_CHANGE':
            return action.data;
        default:
            return state;
    }
}

const rx_store = action.startWith(state).scan((state, action) => {
    // compare the current state with the new state
    return reducer(state, action);
});
const dispatcher = (func) => (...args) => {
    action.next(func(...args));
}

const change_location = dispatcher((new_location) => ({
    type: 'LOC_CHANGE',
    data : {
        location: new_location 
    }
}));

rx_store.subscribe((state) => {
    console.log(state);     
});

change_location('gym');
change_location('work');
change_location('park');
change_location('home');
change_location('home');
change_location('home');
change_location('home');

