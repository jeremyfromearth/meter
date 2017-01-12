import RxStore from './rx-store'
import * as BootstrapActions from '../actions/bootstrap-actions'

class Store extends RxStore {
    reducer(state, action) {
        if(state && action) {
            switch(action.type) {
                case BootstrapActions.BootstrapComplete:
                    return {
                        ...state,
                        song_data: action.data,
                        app_state: {
                            state: 'bootstrap-complete'
                        }
                    }
            }
        } else {
            return state;
        }
    }   
}

export default Store
