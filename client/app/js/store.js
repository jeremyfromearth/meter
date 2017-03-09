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
                case Actions.ClearLog:
                    return {
                        ...state,
                        output_panel: []
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
};

export default Store
