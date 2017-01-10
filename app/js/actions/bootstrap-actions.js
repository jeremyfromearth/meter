import Rx from 'rxjs'
import 'rxjs/observable/dom/ajax'

console.log(Rx.Observable.ajax);

// Action Types
const Bootstrap = 'bootstrap';
const BootstrapComplete = 'bootstrap-complete';

function bootstrap() {
    // Could be a good place to fetch recent settings from local storage
    var observable = Rx.Observable.ajax('./data/filesystem.json');
    observable.subscribe(xhr => {
        console.log(xhr);
        return {
            type: BootstrapComplete,
            data : {

            }
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
