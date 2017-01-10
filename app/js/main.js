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

new View(store.dispatch);
store.dispatch(BootstrapActions.bootstrap_complete());

import {Subject} from 'rxjs/Subject'
import deepEql from 'deep-eql'
import Rx from 'rxjs'

console.log(deepEql);

/*
class State {
    constructor(state) {
        this.state = state;
        this.action = new Subject();
        this.observable = this.action.startsWith(state).scan(this.store);
        this._update = this.dispatcher((new_sate) => ({
            type: 'update_state',
            data: new_state
        }));
    }

    reducer(state, action) {
        return action.new_state;
        // Override with subclass 
    }

    store(state, action) {
        return this.reducer(state, action);
    }

    dispatcher(func) {
        return (...args) => {
            this.action.next(func(...args));
        }
    }

    update(new_state) {
        this._update(new_state);
    }
}
*/

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

const subscription_1 = rx_store.distinctUntilChanged((a, b) => {
    return deepEql(a, b);
}).subscribe((state) => {
    console.log('sub 1', state);     
});

const subscription_2 = 
    rx_store.distinctUntilKeyChanged('location').subscribe((state) => {
        console.log('sub 2', state);     
});

change_location('gym');
change_location('work');
subscription_1.unsubscribe();
change_location('park');
change_location('home');
change_location('home');
change_location('home');
change_location('home');

