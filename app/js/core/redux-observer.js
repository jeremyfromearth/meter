//
// Callback based observer for Redux
// This module allows observers to be notified via 
// a callback when specific properties of the state have been changed
//

// Action Types
// -- adds an observer
var ADD_OBSERVER = '@@redux-observer/add-observer';
// -- removes an observer
var REMOVE_OBSERVER = '@@redux-observer/remove-observer';

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

// Middleware to be provided to applyMiddleware function
function redux_observer(store) {
    var observers = {};
    return function(next) {
        return function(action) {
            switch(action.type) {
                case ADD_OBSERVER:
                    var id = action.data.id;
                    var path = action.data.path;
                    var cb = action.data.callback;
                    observers[path] = observers[path] || {};
                    observers[path][id] = cb;
                    break

                case REMOVE_OBSERVER:
                    var id = action.data.id;
                    var path = action.data.path;
                    var obs = observers[path];
                    if (obs) delete obs[id];
                    break;

                default:
                    var prev_state = store.getState();
                    var result = next(action);
                    var next_state = store.getState();
                    for(var p in observers) {
                        const prev = get_property(p, prev_state);
                        const next = get_property(p, next_state);
                        if(prev !== next) {
                            for(var id in observers[p]) {
                                const callback = observers[p][id];
                                callback(path, prev, next); 
                            }
                        }
                    }
                    return result;
            }
        }
    }
}

// Action for adding an observer
function add_observer(path, id, callback) {
    return {
        type: ADD_OBSERVER,
        data: {
            callback: callback,
            path: path,
            id: id
        }
    }
}

// Action for removing an observer
function remove_observer(path, id) {
    return {
        type: REMOVE_OBSERVER,
        data: {
            path: path,
            id: id
        }
    }
}

export {redux_observer, add_observer, remove_observer}
