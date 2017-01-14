import * as Actions from './actions'
import RxStore from './rx-store'

class Store extends RxStore {
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
                    return result;
                default:
                    return state;
            }
        } else {
            return state;
        }
    }   
}

export default Store
