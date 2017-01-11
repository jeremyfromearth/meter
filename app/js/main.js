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

class RxStore {
    constructor(state = {}) {
        this.action = new Subject();
        this.subject = new Subject();
        this.store = this.action
            .flatMap((action) => {
                if(action instanceof Observable) return action;
                return Observable.from([action]);
            })
            .startWith(state)
            .scan(this.reducer)
            .distinctUntilChanged((a, b) => {
                return deepEql(a, b);
            })
            
        this.store.subscribe(this.subject);
    }

    reducer(state, action) {
        return state;
    }

    dispatch(action) {
        this.action.next(action); 
        if(action.data instanceof Observable) {
            this.action.next(action.data);
        }
        return action;
    }

    subscribe(func, property_chain) {
        if(property_chain) {
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
            return this.subject.distinctUntilChanged((a, b) => {
                var prev = get_property(a, property_chain);
                var next = get_property(b, property_chain);
                return prev == next;
            })
            .subscribe(func);
        } else {
            return this.subject.subscribe(func);
        }
    }
}

class LocationState extends RxStore{
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

            case 'LOAD_COMPLETE':
                return {
                    ...state,
                    song_data: action.data.song_data
                }
            case 'LOAD_ERROR':
                console.log('LOAD ERROR');
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
            .catch(error => {
                return [{
                    type: 'LOAD_ERROR',
                    data: {error}
                }]
            })
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
var subscriber_1 = loc_state.subscribe((state) => {
    console.log('sub: 1 -', state);
}, 'gps.track');

var subscriber_2 = loc_state.subscribe((state) => {
    console.log('sub: 2 -', state);
});

var subscriber_3 = loc_state.subscribe((state) => {
    console.log('sub: 3 -', state);
});

var subscriber_4 = loc_state.subscribe((state) => {
    console.log('sub: 4 -', state);
}, 'song_data');

loc_state.dispatch(do_location_change('home', true));
loc_state.dispatch(do_location_change('work', false));
subscriber_1.unsubscribe();
loc_state.dispatch(do_location_change('park', true));
loc_state.dispatch(load());
