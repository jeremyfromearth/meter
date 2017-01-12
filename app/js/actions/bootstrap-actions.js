import Rx from 'rxjs'
import 'rxjs/observable/dom/ajax'

// Action Types
const Bootstrap = 'bootstrap';
const BootstrapComplete = 'bootstrap-complete';

function bootstrap() {
    return Rx.Observable.ajax('./data/helter-skelter.json')
        .map(xhr => {
            return {
                type: BootstrapComplete,
                data: xhr.response
            }
        });
}

function bootstrap_complete() {
    return {
        type: BootstrapComplete,
        data: {

        }
    }
}
    
function get_initial_data() {
    
}

export {
    bootstrap, Bootstrap, 
    bootstrap_complete, BootstrapComplete
}
