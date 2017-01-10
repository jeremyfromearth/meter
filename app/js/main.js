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

import deepEql from 'deep-eql'
import {Subject, Observable} from 'rxjs'

class State {
    constructor(state = {}) {
        this.subject = new Subject();
        this.store = this.subject.flatMap((action) => {
            if(action instanceof Observable) return action;
            return Observable.from([action]);
        })
        .startWith(state)
        .scan((state, action) => {
            return this.reducer(state, action);
        });
    }

    // Override with subclass
    reducer(state, action) {
        return state;
    }

    dispatch(action) {
        this.subject.next(action); 
        if(action.data instanceof Observable) {
            this.subject.next(action.data);
        }
        return action;
    }

    subscribe(func, mode, property_chain) {
        switch(mode) {
            // listen for any change
            case 'object':
                return this.store.distinctUntilChanged((a, b) => {
                    return deepEql(a, b);
                })
                .subscribe(func);
            // listen for a specific property change
            case 'property':
                const get_property = (object, property_chain) => {
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
                };
                return this.store.distinctUntilChanged((a, b) => {
                    var prev = get_property(a, property_chain);
                    var next = get_property(b, property_chain);
                    return prev == next;
                })
                .subscribe(func);
            default: 
                return this.store.subscribe(func);
        }
    }
}

class LocationState extends State{
    reducer(state, action) {
        console.log(action);
        switch(action.type) {
            case 'LOC_CHANGE':
                return {
                    ...state,
                    location: action.data.location, 
                    gps: {
                        track: action.data.gps.track
                    }
                }

            case 'INIT_COMPLETE':
                console.log('INIT_COMPLETE');
                return state;
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

const load = () => {
    return {
        type: 'LOAD',
        data : Observable.ajax('./data/helter-skelter.json')
            .map(xhr => { 
                return load_complete(xhr.response);
            })
            .catch(error => [{
                type: 'LOAD_ERROR',
                data: {error}
            }])
    }
}

const load_complete = (data) => {
    return {
        type: 'LOAD_COMPLETE', 
        data: {
            song_data: data 
        }
    }
}

var loc_state = new LocationState();
loc_state.subscribe((state) => {
    //console.log('loc subscribre', state);
}, 'property', 'gps.track');

loc_state.dispatch(do_location_change('work', true));
loc_state.dispatch(do_location_change('work', false));
loc_state.dispatch(do_location_change('work', true));
loc_state.dispatch(load());
