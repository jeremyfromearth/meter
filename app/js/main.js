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
import {Observable, Subject, Scheduler} from 'rxjs'

class RxStore {
    constructor(state = {}) {
        this.subject = new Subject();
        this.dispatcher = new Subject();
        const store = this.dispatcher
            .flatMap((action) => {
                if(action instanceof Observable) return action;
                return Observable.from([action]);
            })
            .startWith(state)
            .scan(this.reducer)
            .distinctUntilChanged((a, b) => {
                return deepEql(a, b);
            });
            
        store.subscribe(this.subject);
    }

    reducer(state, action) {
        return state;
    }

    dispatch(action) {
        this.dispatcher.next(action); 
        if(action.data instanceof Observable) {
            this.dispatcher.next(action.data);
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
        if(state && action) {
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
                        song_data: action.data.song_data,
                        user_data: action.data.user_data
                    }
                case 'LOAD_ERROR':
                    console.log('LOAD ERROR');
                    return state;    
                default:
                    return state;
            }
        } else {
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

const load_song_data = () => {
    return Observable.ajax('./data/helter-skelter.json')
        .map(xhr => {
            return xhr.response    
        });
}

const load_user_data = () => {
    return Observable.from([{username: 'Jeremy'}, {username: 'Sonic'}]);
}

const load_session = () => {
    return Observable.from([{session_id: 32, data: {setting: {}}}]).delay(2000);
}

const load = () => {
    return {
        type: 'LOAD',
        data : Observable.zip(
            load_song_data(),
            load_user_data(),
            load_session(),
            (song_data, user_data, async) => {
                return {
                    type: 'LOAD_COMPLETE', 
                    data: {
                        song_data: song_data, 
                        user_data: user_data
                    }
                }
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
