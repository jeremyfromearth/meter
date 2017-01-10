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
                    var prev = this.get_property(a, property_chain);
                    var next = this.get_property(b, property_chain);
                    return (prev == next);
                })
                .subscribe(func);
            default: 
                return this.store.subscribe(func);
        }
    }

    get_property(object, property_chain) {
        var iter = 0;
        var part = null; 
        var obj = object;
        var parts = property_chain.split('.');
        while(parts.length && obj != null) {
            part = parts.shift();
            obj = obj[part];
            iter++;
        }
        return obj
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
