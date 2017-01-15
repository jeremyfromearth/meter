import * as Actions from './actions'
import RxStore from './rx-store'

class Store extends RxStore {
    constructor() {
        super(default_state);
    }
    
    reducer(state, action) {
        if(state && action) {
            switch(action.type) {
                case Actions.BootstrapComplete:
                    var result = {
                        ...state,
                        file_system: {
                            midi_library: action.data.file_system.midi_library
                        }
                    }
                    console.log(result);
                    return result;
                default:
                    return state;
            }
        } else {
            return state;
        }
    }   
}

const default_state = {
    tools : [{
            type: 'Clustering Models',
            modules: [{
                name: 'K-Means',
                options: {}
            }, {
                name: 'K Nearest Neighbors',
                options: {}
            }]
        }, {
            type: 'Analysis', 
            modules: [{
                name: 'Metric / Time',
                options: [{
                    name: 'Metric Name', 
                    options: ['Energy', 'Amplitude', 'Complexity']
                }]
            }]
        }, {
            type: 'Visualizations', 
            modules: [{
                name: 'Clustering'
            }]
        }, {
            type: 'MIDI', 
            modules: [{
                name: 'Simple MIDI Player',
                options: {

                }
            }, {
                name: 'MIDI Writer', 
                options: {
                    
                }
            }]
        }, 
    ]
};

export default Store
