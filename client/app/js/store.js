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
                case Actions.SearchFiles:
                    var result = {
                        ...state,
                        file_search: {
                            ...state.file_search,
                            state: action.data.search,
                        },
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
    file_search: {
        state: {
            artist: true,
            album: true,
            composer: true,
            song_title: true,
            genres: "",
            date_range: "",
            bpm: "",
            file_type: "MIDI"
        },
        config: {
            defaults: ['artist', 'album', 'composer'],
            song_title: {label: 'Song Title'},
            file_type:  {options: ['MIDI', 'Audio'], label: 'File Type'},
            bpm: {placeholder: 'ex. 120 or 90-130', label: 'BPM'},
            genres: {placeholder: 'ex. rock, pop, dance, hip-hop'},
            date_range: {placeholder: 'ex. 2000 or 1954-1970', label: 'Year(s)'},
        }, 
        results: {

        }
    },
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
