import * as Actions from './actions'
import RxStore from './rx-store'

class Store extends RxStore {
    reducer(state, action) {
        if(state && action) {
            switch(action.type) {
                case Actions.BootstrapComplete:
                    return {
                        ...state,
                        filesystem: {
                            midi_library: action.data.filesystem.midi_library
                        }
                    }
            }
        } else {
            return state;
        }
    }   
}

export default Store
