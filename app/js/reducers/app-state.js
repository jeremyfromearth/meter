import * as BootstrapActions from '../actions/bootstrap-actions'

const BootstrapInit = 'bootstrap-init';
const BootstrapComplete = 'bootstrap-complete';

function app_state(state={}, action) {
    switch(action.type) {
        case BootstrapActions.Bootstrap:
            return {state: BootstrapInit};
        case BootstrapActions.BootstrapComplete:
            return {state: BootstrapComplete};
        default:
            return state;
    }
}

export {
    app_state,
    BootstrapInit,
    BootstrapComplete
}
