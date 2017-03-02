import * as Actions from './actions'
import RxStore from './rx-store'
import {MidiInfo} from './midi-info'

class Store extends RxStore {
    constructor() {
        super(default_state);
    }
    
    reducer(state, action) {
        super.reducer(state);
        if(state && action) {
            switch(action.type) {
                case Actions.BootstrapComplete:
                    return {
                        ...state,
                        user_data : action.data,
                        output_panel : state.output_panel.concat(['Bootstrap complete!'])
                    };
                case Actions.Log:
                    return {
                        ...state,
                        output_panel: state.output_panel.concat([action.data])
                    };
                case Actions.SearchFilesComplete:
                    return {
                        ...state,
                        search_results: action.data
                    }
                default:
                    return state;
            }
        } else {
            return state;
        }
    }   
}

const default_state = {
    output_panel: [],
    search_results: [],
    tools : [{
            category: 'Analysis', 
            icon: 'fa-line-chart',
            modules: [{
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
                name: 'K-Means',
                options: {}
            }, {
                name: 'K Nearest Neighbors',
                options: {}
            }]
        },{
            category: 'MIDI', 
            icon: 'fa-music',
            modules: [{
                name: 'Simple MIDI Player',
                options: {}
            }, {
                name: 'MIDI Writer', 
                options: {}
            }, {
                name: 'MIDI Info',
                widget: ()=> { return new MidiInfo(); },
                options: {}
            }]
        },{
            category: 'Visualizations', 
            icon: 'fa-bar-chart-o',
            modules: [{
                name: 'Clustering',
            }]
        },  
    ]
};

export default Store
