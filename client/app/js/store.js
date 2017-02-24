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
                    };
                    return result;
                case Actions.Log:
                    var result = {
                        ...state,
                        output_panel: state.output_panel.concat([action.data])
                    };
                    return result;
                case Actions.SearchFilesComplete:
                    var result = {
                        ...state,
                        file_search: {
                            ...state.file_search,
                            results: action.data.search_results,
                        },
                    };
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
            artist: '',
            bpm: '',
            year: '',
            composer: '',
            duration: 180.0,
            genre: '',
            instrument: '',
            song_title: '',
            video_game: '',
            keywords: ''
        },
        config: {
            artist: {placeholder: 'ex. The Beatles, Alan Parsons Project'},
            composer: {placeholder: 'ex. Hayned, Bach'},
            song_title: {label: 'Song Title', placeholder: 'ex. Glass Onion or Hey Bulldog, Revolution'},
            video_game: {label: 'Video Game Title', placeholder: 'ex. Legend of Zelda or Q-bert, Super Mario'}, 
            genre: {placeholder: 'ex. rock, pop, dance, hip-hop'},
            bpm: {placeholder: 'ex. 120 or 90-130', label: 'BPM'},
            instrument: {placeholder: 'ex. marimba, bass guitar'},
            year: {placeholder: 'ex. 2000 or 1954-1970', label: 'Year'},
            duration: {label: 'Duration (seconds)', range: [5, 1000]},
            ignore: ['keywords']
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
