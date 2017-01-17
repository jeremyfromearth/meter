import * as Actions from './actions'
import RxStore from './rx-store'

class Store extends RxStore {
    constructor() {
        super(default_state);
    }
    
    reducer(state, action) {
        super.reducer(state);
        if(state && action) {
            switch(action.type) {
                case Actions.BootstrapComplete:
                    var result = {
                        ...state,
                        file_system: {
                            midi_library: action.data.file_system.midi_library
                        }, 
                        output_panel : state.output_panel.concat(['Bootstrap complete!'])
                    }
                    return result;
                case Actions.Log:
                    var result = {
                        ...state,
                        output_panel: state.output_panel.concat([action.data])
                    }
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
    file_system: {

    },
    output_panel: [

    ],
    tools : [{
            category: 'Analysis', 
            icon: 'fa-line-chart',
            modules: [{
                id: 0,
                name: 'Metrics Over Time',
                options: [{
                    name: 'Metric Name', 
                    options: ['Energy', 'Amplitude', 'Complexity']
                }]
            }]
        }, {
            category: 'Models',
            icon: 'fa-sitemap',
            modules: [{
                id: 1,
                name: 'K-Means',
                options: {}
            }, {
                id: 2,
                name: 'K Nearest Neighbors',
                options: {}
            }]
        },{
            category: 'MIDI', 
            icon: 'fa-music',
            modules: [{
                id: 3,
                name: 'Simple MIDI Player',
                options: {

                }
            }, {
                id: 4,
                name: 'MIDI Writer', 
                options: {
                    
                }
            }]
        },{
            category: 'Visualizations', 
            icon: 'fa-bar-chart-o',
            modules: [{
                id: 5,
                name: 'Clustering',
            }]
        },  
    ]
};

export default Store
