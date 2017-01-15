// application
import * as Actions from './actions'
import Store from './store'
import {View} from './view'

// css
require('phosphor/styles/base.css')
require('../styles/index.css');
require('../styles/font-awesome.min.css');

// init
const store = new Store() 
new View(store);
store.dispatch(Actions.bootstrap());

var id = 0;
setInterval(function() {
    store.dispatch(Actions.log('Output message: ' + id++)); 
}, 500);

/*
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

// Multiple async operations
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

var subscriber_1 = store.subscribe((state) => {
    console.log('sub: 1 -', state);
}, 'gps.track');

var subscriber_2 = store.subscribe((state) => {
    console.log('sub: 2 -', state);
});

var subscriber_3 = store.subscribe((state) => {
    console.log('sub: 3 -', state);
});

var subscriber_4 = store.subscribe((state) => {
    console.log('sub: 4 -', state);
}, 'song_data');

store.dispatch(do_location_change('home', true));

store.dispatch(do_location_change('work', false));
subscriber_1.unsubscribe();
store.dispatch(do_location_change('park', true));
store.dispatch(load());
*/
