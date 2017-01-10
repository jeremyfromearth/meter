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

class State {
    constructor(state = {}) {
        this.action = new Subject();
        this.store = this.action.startWith(state).scan((state, action) => {
            return this.reducer(state, action);
        });

        this.get_property = (obj, prop) => {
            var iter = 0;
            var obj = object;
            var parts = path.split('.');
            var part = null; 
            while(parts.length && obj != null) {
                part = parts.shift();
                obj = obj[part];
                iter++;
            }
            return obj
        }
    }

    // Override with subclass
    reducer(state, action) {
        return state;
    }

    dispatch(action) {
        this.action.next(action); 
    }

    subscribe(func, mode, property_chain) {
        switch(mode) {
            case 'object':
                return this.store.distinctUntilChanged((a, b) => {
                    return deepEql(a, b);
                }).subscribe(func);
            case 'property':
                return this.store.distinctUntilChanged((a, b) => {
                    return (get_property(property_chain, a) == get_property(property_chain, b));
                })
                .subscribe(func);
            default: 
                return this.store.subscribe(func);
        }
    }
}

class LocationState extends State{
    reducer(state, action) {
        switch(action.type) {
            case 'LOC_CHANGE':
                return {
                    ...state,
                    location: action.data.location, 
                    gps: {
                        track: action.data.gps.track
                    }
                }
            default:
                return state;
        }
    }
}

const do_location_change = (loc, do_track) => {
    return {
        type: 'LOC_CHANGE',
        data: {
            location: loc,
            gps: {
                track: do_track
            }
        }
    }
}

var loc_state = new LocationState();
loc_state.subscribe((state) => {
    console.log('loc state subscriber', state);
}, 'property', 'gps.track');

loc_state.dispatch(do_location_change('work', true));
loc_state.dispatch(do_location_change('work', false));
loc_state.dispatch(do_location_change('work', true));
loc_state.dispatch(do_location_change('work', false));
loc_state.dispatch(do_location_change('work', true));
loc_state.dispatch(do_location_change('work', true));

const action = new Subject();
const state = {};
const reducer = (state, action) => {
    switch(action.type) {
        case 'LOC_CHANGE':
            return {location: action.data.location, gps: {track: action.data.gps.track}}
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

const change_location = dispatcher((new_location, do_track) => ({
    type: 'LOC_CHANGE',
    data : {
        location: new_location, 
        gps : {
            track: do_track
        }
    }
}));

const subscription_1 = rx_store.distinct().subscribe((state) => {
    //console.log('sub 1', state);     
});

const subscription_2 = 
    rx_store.distinctUntilKeyChanged('gps').subscribe((state) => {
        //console.log('sub 2', state);     
});

// Utility for accessing the value of a nested property of an object using a string path to the property
// var x = {a: {b: {c: 42}}}
// console.log(get_property('a.b.c.', x)) // outputs 42
// console.log(get_property('a.b.c.', x)) // outputs 42
function get_property(path, object) {
    var iter = 0;
    var obj = object;
    var parts = path.split('.');
    var part = null; 
    while(parts.length && obj != null) {
        part = parts.shift();
        obj = obj[part];
        iter++;
    }
    return obj
}

var path = 'gps.track';
const subscription_3 = 
    rx_store.distinctUntilChanged((a, b) => {
        return (get_property(path, a) == get_property(path, b));
    })
    .subscribe((state) => {
        //console.log('sub 3', state);
    });

/*
change_location('gym', false);
change_location('work', false);
change_location('park', true);
change_location('home', false);
change_location('home', false);
change_location('home', false);
change_location('home');
change_location('home');
change_location('home');
*/

